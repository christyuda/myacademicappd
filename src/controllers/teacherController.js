const teacherModel = require('../models/Teachers');
const userModel = require('../models/Users');
const { getPagination, getPagingData } = require('../utils/paginationHelper'); // Import helper
const baseUrl = '/api/teachers';

// Create teacher from user
const createTeacherFromUser = async (req, res) => {
    const {
        email,
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
        // Find user by email
        const user = await userModel.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found with the provided email' });
        }

        // Check if user status is active
        if (user.status !== true) {
            return res.status(400).json({ message: 'User is not active. Cannot generate teacher.' });
        }

        const userId = user.id;

        // Check if teacher with the same user_id already exists
        const existingTeacher = await teacherModel.findOne({ where: { user_id: userId } });

        if (existingTeacher) {
            return res.status(400).json({ message: 'Teacher already exists for this user' });
        }

        // Create teacher
        const newTeacher = await teacherModel.create({
            user_id: userId,
            nip,
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
            is_wali_kelas: isWaliKelas,
        });

        return res.status(201).json({
            statusCode: 201,
            message: 'Teacher created successfully',
            data: {
                id: newTeacher.id,
                user_id: newTeacher.user_id,
                nip: newTeacher.nip,
                nama_lengkap: newTeacher.nama_lengkap,
                tempat_lahir: newTeacher.tempat_lahir,
                tanggal_lahir: newTeacher.tanggal_lahir,
                jenis_kelamin: newTeacher.jenis_kelamin,
                agama: newTeacher.agama,
                alamat: newTeacher.alamat,
                no_telepon: newTeacher.no_telepon,
                tanggal_masuk: newTeacher.tanggal_masuk,
                status: newTeacher.status,
                catatan_khusus: newTeacher.catatan_khusus,
                is_wali_kelas: newTeacher.is_wali_kelas,
                created_at: newTeacher.created_at,
                updated_at: newTeacher.updated_at,
            },
        });
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

const updateTeacher = async (req, res) => {
    const { id } = req.params;
    const {
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
        const teacher = await teacherModel.findByPk(id);

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        await teacher.update({
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

        res.status(200).json({
            message: 'Teacher updated successfully',
            data: teacher,
        });
    } catch (error) {
        console.error('Error updating teacher:', error);
        res.status(500).json({ error: error.message });
    }
};

const deleteTeacher = async (req, res) => {
    const { id } = req.params;

    try {
        const teacher = await teacherModel.findByPk(id);

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        await teacher.destroy();

        res.status(200).json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        console.error('Error deleting teacher:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createTeacherFromUser,
    getAllTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher,
};
