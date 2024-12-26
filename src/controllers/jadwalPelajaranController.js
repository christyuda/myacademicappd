const jadwalPelajaranModel = require('../models/JadwalPelajaran');
const { getPagination, getPagingData } = require('../utils/paginationHelper');
const { sequelize } = require('../config/dbConfig');

// Create a Jadwal Pelajaran
const createJadwalPelajaran = async (req, res) => {
    const { kelas_id, mata_pelajaran_id, teacher_id, semester_tahun_ajaran_id, hari, jam_mulai, jam_selesai } = req.body;

    try {
        const newJadwalPelajaran = await jadwalPelajaranModel.create({
            kelas_id,
            mata_pelajaran_id,
            teacher_id,
            semester_tahun_ajaran_id,
            hari,
            jam_mulai,
            jam_selesai,
        });

        return res.status(201).json({
            status: true,
            code: "SUCCESS",
            message: "Jadwal Pelajaran created successfully",
            data: {
                id: newJadwalPelajaran.id,
                kelas_id: newJadwalPelajaran.kelas_id,
                mata_pelajaran_id: newJadwalPelajaran.mata_pelajaran_id,
                teacher_id: newJadwalPelajaran.teacher_id,
                semester_tahun_ajaran_id: newJadwalPelajaran.semester_tahun_ajaran_id,
                hari: newJadwalPelajaran.hari,
                jam_mulai: newJadwalPelajaran.jam_mulai,
                jam_selesai: newJadwalPelajaran.jam_selesai,
                created_at: newJadwalPelajaran.created_at,
                updated_at: newJadwalPelajaran.updated_at,
            },
            error: null,
            statusCode: 201,
        });
    } catch (error) {
        console.error('Error creating Jadwal Pelajaran:', error);
        return res.status(500).json({
            status: false,
            code: "ERROR",
            message: "Internal server error",
            data: null,
            error: error.message,
            statusCode: 500,
        });
    }
};


// Get all Jadwal Pelajaran with pagination
const getAllJadwalPelajaran = async (req, res) => {
    const { page = 1, size = 10 } = req.query;
    const { limit, offset } = getPagination(page, size);

    try {
        const query = `
            SELECT 
                jp.id, 
                jp.kelas_id, 
                k.nama_kelas AS nama_kelas, 
                jp.mata_pelajaran_id, 
                mp.nama_pelajaran AS nama_pelajaran, 
                jp.teacher_id, 
                t.nama_lengkap AS nama_guru, 
                jp.semester_tahun_ajaran_id, 
                sta.tahun_ajaran, 
                sta.semester, 
                jp.hari, 
                jp.jam_mulai, 
                jp.jam_selesai, 
                jp.created_at, 
                jp.updated_at
            FROM jadwal_pelajaran jp
            LEFT JOIN kelas k ON jp.kelas_id = k.id
            LEFT JOIN mata_pelajaran mp ON jp.mata_pelajaran_id = mp.id
            LEFT JOIN teachers t ON jp.teacher_id = t.id
            LEFT JOIN semester_tahun_ajaran sta ON jp.semester_tahun_ajaran_id = sta.id
            ORDER BY jp.created_at DESC
            LIMIT :limit OFFSET :offset
        `;

        const data = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { limit, offset },
        });

        const totalItems = await jadwalPelajaranModel.count();
        const response = {
            items: data,
            pagination: {
                totalItems,
                currentPage: parseInt(page),
                perPage: parseInt(size),
                totalPages: Math.ceil(totalItems / size),
                urls: {
                    current: `/api/jadwalPelajaran?page=${page}&size=${size}`,
                    prev: page > 1 ? `/api/jadwalPelajaran?page=${page - 1}&size=${size}` : null,
                    next: page < Math.ceil(totalItems / size) ? `/api/jadwalPelajaran?page=${parseInt(page) + 1}&size=${size}` : null,
                },
            },
        };

        res.status(200).json({
            status: true,
            code: 'SUCCESS',
            message: 'Jadwal Pelajaran fetched successfully',
            data: response,
        });
    } catch (error) {
        console.error('Error fetching Jadwal Pelajaran:', error);
        res.status(500).json({
            status: false,
            code: 'ERROR',
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Get a single Jadwal Pelajaran by ID
const getJadwalPelajaranById = async (req, res) => {
    const { id } = req.params;

    try {
        const jadwalPelajaran = await jadwalPelajaranModel.findByPk(id);

        if (!jadwalPelajaran) {
            return res.status(404).json({ message: 'Jadwal Pelajaran not found' });
        }

        res.status(200).json(jadwalPelajaran);
    } catch (error) {
        console.error('Error fetching Jadwal Pelajaran:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update a Jadwal Pelajaran
const updateJadwalPelajaran = async (req, res) => {
    const { id } = req.params;
    const { kelas_id, mata_pelajaran_id, teacher_id, semester_tahun_ajaran_id, hari, jam_mulai, jam_selesai } = req.body;

    try {
        const jadwalPelajaran = await jadwalPelajaranModel.findByPk(id);

        if (!jadwalPelajaran) {
            return res.status(404).json({
                status: false,
                code: "NOT_FOUND",
                message: "Jadwal Pelajaran not found",
                data: null,
                error: null,
                statusCode: 404,
            });
        }

        await jadwalPelajaran.update({
            kelas_id,
            mata_pelajaran_id,
            teacher_id,
            semester_tahun_ajaran_id,
            hari,
            jam_mulai,
            jam_selesai,
        });

        return res.status(200).json({
            status: true,
            code: "SUCCESS",
            message: "Jadwal Pelajaran updated successfully",
            data: {
                id: jadwalPelajaran.id,
                kelas_id: jadwalPelajaran.kelas_id,
                mata_pelajaran_id: jadwalPelajaran.mata_pelajaran_id,
                teacher_id: jadwalPelajaran.teacher_id,
                semester_tahun_ajaran_id: jadwalPelajaran.semester_tahun_ajaran_id,
                hari: jadwalPelajaran.hari,
                jam_mulai: jadwalPelajaran.jam_mulai,
                jam_selesai: jadwalPelajaran.jam_selesai,
                created_at: jadwalPelajaran.created_at,
                updated_at: jadwalPelajaran.updated_at,
            },
            error: null,
            statusCode: 200,
        });
    } catch (error) {
        console.error('Error updating Jadwal Pelajaran:', error);
        return res.status(500).json({
            status: false,
            code: "ERROR",
            message: "Internal server error",
            data: null,
            error: error.message,
            statusCode: 500,
        });
    }
};



// Delete a Jadwal Pelajaran
const deleteJadwalPelajaran = async (req, res) => {
    const { id } = req.params;

    try {
        const jadwalPelajaran = await jadwalPelajaranModel.findByPk(id);

        if (!jadwalPelajaran) {
            return res.status(404).json({
                status: false,
                code: "NOT_FOUND",
                message: "Jadwal Pelajaran not found",
                data: null,
                error: null,
                statusCode: 404,
            });
        }

        await jadwalPelajaran.destroy();

        return res.status(200).json({
            status: true,
            code: "SUCCESS",
            message: "Jadwal Pelajaran deleted successfully",
            data: null,
            error: null,
            statusCode: 200,
        });
    } catch (error) {
        console.error('Error deleting Jadwal Pelajaran:', error);
        return res.status(500).json({
            status: false,
            code: "ERROR",
            message: "Internal server error",
            data: null,
            error: error.message,
            statusCode: 500,
        });
    }
};


module.exports = {
    createJadwalPelajaran,
    getAllJadwalPelajaran,
    getJadwalPelajaranById,
    updateJadwalPelajaran,
    deleteJadwalPelajaran,
};
