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
