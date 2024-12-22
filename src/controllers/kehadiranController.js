const kehadiranModel = require('../models/Kehadiran');
const { getPagination, getPagingData } = require('../utils/paginationHelper');

// Create a new Kehadiran
const createKehadiran = async (req, res) => {
    const { student_id, jadwal_pelajaran_id, semester_tahun_ajaran_id, tanggal, status, keterangan } = req.body;

    try {
        // Buat entri Kehadiran baru
        const newKehadiran = await kehadiranModel.create({
            student_id,
            jadwal_pelajaran_id,
            semester_tahun_ajaran_id,
            tanggal,
            status,
            keterangan,
        });

        // Format respons sesuai permintaan
        return res.status(201).json({
            statusCode: 201,
            message: 'Kehadiran created successfully',
            data: {
                id: newKehadiran.id,
                student_id: newKehadiran.student_id,
                jadwal_pelajaran_id: newKehadiran.jadwal_pelajaran_id,
                semester_tahun_ajaran_id: newKehadiran.semester_tahun_ajaran_id,
                tanggal: newKehadiran.tanggal,
                status: newKehadiran.status,
                keterangan: newKehadiran.keterangan,
                created_at: newKehadiran.created_at,
                updated_at: newKehadiran.updated_at,
            },
        });
    } catch (error) {
        console.error('Error creating Kehadiran:', error);
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};


// Get all Kehadiran with pagination
const getAllKehadiran = async (req, res) => {
    const { page = 1, size = 10 } = req.query;
    const { limit, offset } = getPagination(page, size);

    try {
        const data = await kehadiranModel.findAndCountAll({
            limit,
            offset,
            order: [['tanggal', 'DESC']],
        });

        const response = getPagingData(data, page, limit, '/api/kehadiran');
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching Kehadiran:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get a single Kehadiran by ID
const getKehadiranById = async (req, res) => {
    const { id } = req.params;

    try {
        const kehadiran = await kehadiranModel.findByPk(id);

        if (!kehadiran) {
            return res.status(404).json({ message: 'Kehadiran not found' });
        }

        res.status(200).json(kehadiran);
    } catch (error) {
        console.error('Error fetching Kehadiran:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update a Kehadiran
const updateKehadiran = async (req, res) => {
    const { id } = req.params;
    const { student_id, jadwal_pelajaran_id, semester_tahun_ajaran_id, tanggal, status, keterangan } = req.body;

    try {
        // Cari kehadiran berdasarkan ID
        const kehadiran = await kehadiranModel.findByPk(id);

        if (!kehadiran) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Kehadiran not found',
                data: null,
            });
        }

        // Perbarui data kehadiran
        await kehadiran.update({
            student_id,
            jadwal_pelajaran_id,
            semester_tahun_ajaran_id,
            tanggal,
            status,
            keterangan,
        });

        // Format respons sukses
        return res.status(200).json({
            statusCode: 200,
            message: 'Kehadiran updated successfully',
            data: {
                id: kehadiran.id,
                student_id: kehadiran.student_id,
                jadwal_pelajaran_id: kehadiran.jadwal_pelajaran_id,
                semester_tahun_ajaran_id: kehadiran.semester_tahun_ajaran_id,
                tanggal: kehadiran.tanggal,
                status: kehadiran.status,
                keterangan: kehadiran.keterangan,
                created_at: kehadiran.created_at,
                updated_at: kehadiran.updated_at,
            },
        });
    } catch (error) {
        console.error('Error updating Kehadiran:', error);
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};


// Delete a Kehadiran
const deleteKehadiran = async (req, res) => {
    const { id } = req.params;

    try {
        // Cari kehadiran berdasarkan ID
        const kehadiran = await kehadiranModel.findByPk(id);

        if (!kehadiran) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Kehadiran not found',
                data: null,
            });
        }

        // Hapus data kehadiran
        await kehadiran.destroy();

        // Format respons sukses
        return res.status(200).json({
            statusCode: 200,
            message: 'Kehadiran deleted successfully',
            data: null,
        });
    } catch (error) {
        console.error('Error deleting Kehadiran:', error);
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

module.exports = {
    createKehadiran,
    getAllKehadiran,
    getKehadiranById,
    updateKehadiran,
    deleteKehadiran,
};
