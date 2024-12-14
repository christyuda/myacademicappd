const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users'); // Path sesuai dengan lokasi model Anda
const { sendEmail } = require('../services/emailService'); 

const SECRET_KEY = process.env.SECRET_KEY;

// Penyimpanan sementara menggunakan Map
const verificationCodes = new Map();

// Register Function
exports.register = async (req, res) => {
    try {
        const { email, password, role_id } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Buat pengguna dengan status awal 0
        const newUser = await Users.create({
            email,
            password: hashedPassword,
            role_id,
            status: 0 
        });

        res.status(201).json({ message: 'User registered successfully', data: newUser });
    } catch (error) {
        // Menangani error validasi Sequelize
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const messages = error.errors.map(err => err.message);
            return res.status(400).json({ message: 'Validation error', errors: messages });
        }

        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};


// Login Function
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role_id: user.role_id },
            SECRET_KEY,
            { expiresIn: '1d' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

exports.sendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email wajib diisi' });
        }

        // Generate kode verifikasi
        const verificationCode = crypto.randomInt(100000, 999999).toString();

        const expiresAt = Date.now() + 24 * 60 * 60 * 1000; 
        verificationCodes.set(email, { code: verificationCode, expiresAt });

        // Konten email
        const subject = 'Verifikasi Email';
        const text = `Terima kasih telah mendaftar di MyAcademy! Untuk menyelesaikan proses pendaftaran Anda, gunakan kode verifikasi berikut: ${verificationCode}. Jika Anda tidak meminta email ini, abaikan. Kode ini akan kedaluwarsa dalam 10 menit.`;
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f7f9fc;
                    margin: 0;
                    padding: 0;
                    color: #333333;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .email-header {
                    background-color: #4CAF50;
                    color: #ffffff;
                    text-align: center;
                    padding: 20px;
                }
                .email-header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .email-body {
                    padding: 20px;
                    text-align: center;
                }
                .email-body p {
                    font-size: 16px;
                    margin: 10px 0;
                    line-height: 1.6;
                }
                .email-body .verification-code {
                    display: inline-block;
                    background-color: #4CAF50;
                    color: #ffffff;
                    font-size: 20px;
                    font-weight: bold;
                    padding: 10px 20px;
                    border-radius: 4px;
                    margin: 20px 0;
                    text-decoration: none;
                }
                .email-footer {
                    background-color: #f7f9fc;
                    color: #666666;
                    text-align: center;
                    padding: 15px;
                    font-size: 14px;
                }
                .email-footer a {
                    color: #4CAF50;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <h1>Selamat Datang di MyAcademy</h1>
                </div>
                <div class="email-body">
                    <p>Halo,</p>
                    <p>Terima kasih telah mendaftar di <strong>MyAcademy</strong>! Untuk menyelesaikan proses pendaftaran Anda, silakan gunakan kode verifikasi berikut:</p>
                    <div class="verification-code">${verificationCode}</div>
                    <p>Jika Anda tidak meminta email ini, silakan abaikan. Kode ini akan kedaluwarsa dalam <strong>10 menit</strong>.</p>
                </div>
                <div class="email-footer">
                    <p>Butuh bantuan? Hubungi <a href="mailto:support@myacademy.com">tim dukungan kami</a>.</p>
                    <p>&copy; 2024 MyAcademy. Hak cipta dilindungi.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        // Kirim email
        const previewUrl = await sendEmail(email, subject, text, html);

        console.log(`Kode verifikasi untuk ${email}: ${verificationCode}`);

        res.status(200).json({ message: 'Email verifikasi berhasil dikirim', previewUrl });
    } catch (error) {
        console.error('Error in sendVerificationEmail:', error);
        res.status(500).json({ message: 'Gagal mengirim email verifikasi', error: error.message });
    }
};


exports.verifyEmailCode = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;

        // Validasi input
        if (!email || !verificationCode) {
            return res.status(400).json({ message: 'Email dan kode verifikasi wajib diisi' });
        }

        const storedData = verificationCodes.get(email);

        if (!storedData) {
            return res.status(400).json({ message: 'Kode verifikasi tidak ditemukan atau telah kedaluwarsa' });
        }

        if (storedData.code !== verificationCode) {
            return res.status(400).json({ message: 'Kode verifikasi tidak valid' });
        }

        if (Date.now() > storedData.expiresAt) {
            verificationCodes.delete(email);
            return res.status(400).json({ message: 'Kode verifikasi telah kedaluwarsa' });
        }

        verificationCodes.delete(email);

        // Cari user berdasarkan email
        const user = await Users.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
        }

        // Update status user menjadi "terverifikasi"
        await user.update({
            status: 1,
        });

        res.status(200).json({ message: 'Pengguna berhasil diverifikasi' });
    } catch (error) {
        console.error('Error in verifyEmailCode:', error);
        res.status(500).json({ message: 'Gagal memverifikasi kode', error: error.message });
    }
};
