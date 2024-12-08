const teacherModel = require('../models/Teachers');
const userModel = require('../models/Users');
const { getPagination, getPagingData } = require('../utils/paginationHelper'); // Import helper
const baseUrl = '/api/teachers';

// Create teacher from user
const createTeacherFromUser = async (req, res) => {
    const {
        userId,
        nip,
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
        isWaliKelas = 0,
    } = req.body;

    try {
        // Find user by ID
        const user = await userModel.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if teacher with the same user_id already exists
        const existingTeacher = await teacherModel.findOne({ where: { user_id: userId } });

        if (existingTeacher) {
            return res.status(400).json({ message: 'Teacher already exists for this user' });
        }

        // Create teacher
        const newTeacher = await teacherModel.create({
            user_id: userId,
            nip,
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
            is_wali_kelas: isWaliKelas,
        });

        res.status(201).json(newTeacher);
    } catch (error) {
        console.error('Error creating teacher:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get all teachers
const getAllTeachers = async (req, res) => {
    const { page = 1, size = 10 } = req.query; // Ambil parameter `page` dan `size` dari query string
    const { limit, offset } = getPagination(page, size); // Gunakan helper untuk limit dan offset
    const baseUrl = '/api/teachers'; // Pastikan baseUrl didefinisikan

    try {
        // Fetch data dengan pagination dan include relasi users
        const data = await teacherModel.findAndCountAll({
            limit,
            offset,
            include: [
                {
                    model: userModel,
                    as: 'user', // Pastikan alias sesuai dengan relasi di model
                    attributes: ['email'], // Ambil hanya atribut email
                },
            ],
            order: [['created_at', 'DESC']], // Tambahkan order default
        });

        // Format data untuk pagination
        const response = getPagingData(data, page, limit, baseUrl);

        // Jika tidak ada data, beri respons kosong
        if (response.items.length === 0) {
            return res.status(200).json({
                message: 'No teachers found',
                pagination: response.pagination,
                items: [],
            });
        }

        // Beri respons data yang ditemukan
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching teachers with pagination:', error);

        // Respons error lebih deskriptif
        res.status(500).json({
            error: 'An error occurred while fetching teachers',
            details: error.message,
        });
    }
};

const getTeacherById = async (req, res) => {
    const { id } = req.params;

    try {
        const teacher = await teacherModel.findByPk(id, {
            include: [
                {
                    model: userModel,
                    as: 'user', // Alias relasi
                    attributes: ['email'], // Data dari tabel Users
                },
            ],
        });

        if (teacher) {
            res.status(200).json(teacher);
        } else {
            res.status(404).json({ message: 'Teacher not found' });
        }
    } catch (error) {
        console.error('Error fetching teacher:', error);
        res.status(500).json({ error: error.message });
    }
};
module.exports = {
    createTeacherFromUser,
    getAllTeachers,
    getTeacherById,
};
