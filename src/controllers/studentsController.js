const userModel = require('../models/Users'); // Import User Model
const studentModel = require('../models/Students'); // Import Student Model
const { getPagination, getPagingData } = require('../utils/paginationHelper'); // Import helper

const baseUrl = '/api/students';    
// Create student from user
const createStudentFromUser = async (req, res) => {
    const {
        email,
        nis,
        namaLengkap,
        tempatLahir,
        tanggalLahir,
        jenisKelamin,
        agama,
        alamat,
        noTelepon,
        tanggalMasuk,
        status = 'Aktif',
        catatanKhusus = null,
    } = req.body;

    try {
        // Find user by email
        const user = await userModel.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found with the provided email' });
        }

        // Check if user status is active
        if (user.status !== true) { 
            return res.status(400).json({ message: 'User is not active. Cannot generate student.' });
        }

        }

        // Check if user status is active
        if (user.status !== true) { 
            return res.status(400).json({ message: 'User is not active. Cannot generate student.' });
        }

        const userId = user.id;

        // Check if student with the same user_id already exists
        const existingStudent = await studentModel.findOne({ where: { user_id: userId } });

        if (existingStudent) {
            return res.status(400).json({ message: 'Student already exists for this user' });
        }

        // Create student
        const newStudent = await studentModel.create({
            user_id: userId,
            nis,
            email,
            nama_lengkap: namaLengkap,
            tempat_lahir: tempatLahir,
            tanggal_lahir: tanggalLahir,
            jenis_kelamin: jenisKelamin,
            agama,
            alamat,
            no_telepon: noTelepon,
            tanggal_masuk: tanggalMasuk,
            status,
            catatan_khusus: catatanKhusus,
        });

        return res.status(201).json({
            statusCode: 201,
            message: 'Student created successfully',
            data: {
                id: newStudent.id,
                user_id: newStudent.user_id,
                nis: newStudent.nis,
                nama_lengkap: newStudent.nama_lengkap,
                tempat_lahir: newStudent.tempat_lahir,
                tanggal_lahir: newStudent.tanggal_lahir,
                jenis_kelamin: newStudent.jenis_kelamin,
                agama: newStudent.agama,
                alamat: newStudent.alamat,
                no_telepon: newStudent.no_telepon,
                tanggal_masuk: newStudent.tanggal_masuk,
                status: newStudent.status,
                catatan_khusus: newStudent.catatan_khusus,
                created_at: newStudent.created_at,
                updated_at: newStudent.updated_at,
            },
        });
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ error: error.message });
    }
};

const getAllStudents = async (req, res) => {
    const { page = 1, size = 10 } = req.query; // Ambil parameter `page` dan `size` dari query string
    const { limit, offset } = getPagination(page, size); // Gunakan helper untuk limit dan offset
    const baseUrl = '/api/students'; // Base URL untuk pagination links

    try {
        // Fetch data siswa dengan pagination dan include relasi users untuk email
        const data = await studentModel.findAndCountAll({
            limit,
            offset,
            include: [
                {
                    model: userModel,
                    as: 'user', // Alias yang sesuai dengan relasi di model
                    attributes: ['email'], // Ambil hanya atribut email dari relasi
                },
            ],
            order: [['created_at', 'DESC']], // Default order berdasarkan created_at
        });

        // Format data untuk pagination
        const response = getPagingData(data, page, limit, baseUrl);

        // Menghitung Periode berdasarkan data siswa yang ditemukan
        let startDate = null;
        let endDate = null;

        // Untuk menghitung siswa per bulan
        const studentsPerMonth = new Array(12).fill(0);

        response.items.forEach(student => {
            const month = new Date(student.tanggal_masuk).getMonth(); // Mendapatkan bulan dari tanggal masuk
            studentsPerMonth[month] += 1;

            // Tentukan start date dan end date berdasarkan tanggal_masuk
            const studentDate = new Date(student.tanggal_masuk); // Convert to Date object
            if (!startDate || studentDate < startDate) {
                startDate = studentDate;
            }
            if (!endDate || studentDate > endDate) {
                endDate = studentDate;
            }
        });

        // Tentukan periode berdasarkan start dan end date
        let period = 'No data for period';
        if (startDate && endDate) {
            const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
            period = `${months[startDate.getMonth()]} - ${months[endDate.getMonth()]} ${endDate.getFullYear()}`;
        }

        // Jika tidak ada data siswa, beri respons kosong
        if (response.items.length === 0) {
            return res.status(200).json({
                message: 'No students found',
                pagination: response.pagination,
                items: [],
                metrics: {
                    period: 'January - December 2024', // Default period if no students are found
                },
            });
        }

        // Berikan respons data yang ditemukan dengan tambahan metrics
        res.status(200).json({
            message: 'Students retrieved successfully',
            pagination: response.pagination,
            items: response.items,
            metrics: {
                period: period, // Add the calculated period
            },
        });
    } catch (error) {
        console.error('Error fetching students with pagination:', error);

        // Respons error dengan lebih jelas
        res.status(500).json({
            message: 'An error occurred while fetching students',
            error: {
                details: error.message,
                stack: error.stack, // Bisa menambahkan stack trace untuk debugging
            },
        });
    }
};

// Get student by ID
const getStudentById = async (req, res) => {
    const { id } = req.params;

    try {
        const student = await studentModel.findByPk(id, {
            include: [
                {
                    model: userModel,
                    as: 'user', 
                    attributes: ['email'], // Ambil atribut tertentu dari tabel Users
                },
            ],
        });

        if (student) {
            res.status(200).json(student);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createStudentFromUser,
    getAllStudents,
    getStudentById,
};
