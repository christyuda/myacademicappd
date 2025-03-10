const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users'); // Path sesuai dengan lokasi model Anda
const { sendEmail } = require('../services/emailService'); 
const Tokens = require('../models/Token'); // Path sesuai dengan lokasi model Anda
const Teachers = require('../models/Teachers'); // Path sesuai dengan lokasi model Anda
const Students = require('../models/Students'); // Path sesuai dengan lokasi model Anda

const SECRET_KEY = process.env.SECRET_KEY;
// Register Function
exports.register = async (req, res) => {
    try {
        const { email, password, role_id } = req.body;

        // Validasi input wajib
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                code: 400,
                message: 'Email and password are required',
                data: null
            });
        }

        // Validasi duplikat email
        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                code: 400,
                message: 'Email already exists. Please use another email.',
                data: null
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Buat pengguna dengan status awal 0
        const newUser = await Users.create({
            email,
            password: hashedPassword,
            role_id,
            status: 0
        });

        // Kirim respons sukses
        res.status(201).json({
            status: 'success',
            code: 201,
            message: 'User registered successfully',
            data: {
                id: newUser.id,
                email: newUser.email,
                role_id: newUser.role_id,
                status: newUser.status,
                created_at: newUser.createdAt
            }
        });
    } catch (error) {
        // Menangani error validasi Sequelize
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const messages = error.errors.map(err => err.message);
            return res.status(400).json({
                status: 'error',
                code: 400,
                message: 'Validation error',
                errors: messages,
                data: null
            });
        }

        // Tangani error lain
        res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Registration failed',
            error: error.message,
            data: null
        });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validasi input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Cari user berdasarkan email
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validasi password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Cari role terkait (teacher, student, principal)
        const teacher = await Teachers.findOne({ where: { user_id: user.id } });
        const student = await Students.findOne({ where: { user_id: user.id } });
        // const principal = await Principals.findOne({ where: { user_id: user.id } });
        let login_as;
        switch (user.role_id) {
            case 998:
                login_as = "Super Admin";
                break;
            case 2:
                login_as = "Guru";
                break;
            case 3:
                login_as = "Kepala Sekolah";
                break;
            default:
                login_as = "unknown";
                break;
        }
        // Generate token dengan tambahan informasi role_id dan ID terkait
        const tokenPayload = {
            id: user.id,
            email: user.email,
            role_id: user.role_id,
            teacher_id: teacher ? teacher.id : 0,
            student_id: student ? student.id : 0,
            // principal_id: principal ? principal.id : null,
        };

        const token = jwt.sign(tokenPayload, process.env.SECRET_KEY, { expiresIn: '1d' });

        // Cari atau buat token baru di tabel tokens
        let tokenRecord = await Tokens.findOne({ where: { user_id: user.id } });
        if (tokenRecord) {
            tokenRecord.access_count += 1;
            tokenRecord.token = token;
        } else {
            tokenRecord = await Tokens.create({
                user_id: user.id,
                token: token,
                access_count: 1,
            });
        }

        await tokenRecord.save();

        res.status(200).json({
            message: 'Login successful',
            data: {
                token: `${tokenRecord.access_count}|${token}`,
                role_id: user.role_id,
                email: user.email,
                login_as: login_as,

                
              
                // principal_id: principal ? principal.id : null,
            },
        });
    } catch (error) {
        console.error('Login error:', error.message);
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
        const user = await Users.findOne({ where: { email } });
        if (user) {
            await user.update({ verificationCode });
        } else {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        // Simpan kode ke database atau log (sesuaikan dengan kebutuhan Anda)
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

        if (!email || !verificationCode) {
            return res.status(400).json({ message: 'Email and verification code are required' });
        }

        // Cari user berdasarkan email dan kode verifikasi
        const user = await Users.findOne({
            where: { email, verificationCode }
        });

        if (!user) {
            return res.status(404).json({ message: 'Invalid email or verification code' });
        }

        // Perbarui status user
        await user.update({
            status: 1, // Set status ke verified
            verificationCode: null // Hapus kode verifikasi
        });

        res.status(200).json({ message: 'User verified successfully' });
    } catch (error) {
        console.error('Error in verifyEmailCode:', error);
        res.status(500).json({ message: 'Verification failed', error: error.message });
    }
};
