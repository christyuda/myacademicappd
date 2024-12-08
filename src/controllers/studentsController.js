const userModel = require('../models/Users'); // Import User Model
const studentModel = require('../models/Students'); // Import Student Model
const { getPagination, getPagingData } = require('../utils/paginationHelper'); // Import helper
const baseUrl = '/api/students';    
// Create student from user
const createStudentFromUser = async (req, res) => {
    const {
        userId,
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
        // Find user by ID
        const user = await userModel.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if student with the same user_id already exists
        const existingStudent = await studentModel.findOne({ where: { user_id: userId } });

        if (existingStudent) {
            return res.status(400).json({ message: 'Student already exists for this user' });
        }

        // Create student
        const newStudent = await studentModel.create({
            user_id: userId,
            nis,
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

        res.status(201).json(newStudent);
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get all students
const getAllStudents = async (req, res) => {
    const { page = 1, size = 10 } = req.query; // Ambil parameter `page` dan `size` dari query string
    const { limit, offset } = getPagination(page, size);

    try {
        const data = await studentModel.findAndCountAll({
            limit,
            offset,
            include: [
                {
                    model: userModel,
                    as: 'user', // Alias yang sesuai dengan relasi
                    attributes: ['email'], // Ambil atribut tertentu dari tabel users
                },
            ],
        });

        // Format data menggunakan helper
        const response = getPagingData(data, page, limit, baseUrl);

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching students with pagination:', error);
        res.status(500).json({ error: error.message });
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
