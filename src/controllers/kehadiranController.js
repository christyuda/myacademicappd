const kehadiranModel = require('../models/Kehadiran');
const { getPagination, getPagingData } = require('../utils/paginationHelper');

// Create a new Kehadiran
const createKehadiran = async (req, res) => {
    const { student_id, jadwal_pelajaran_id, semester_tahun_ajaran_id, tanggal, status, keterangan } = req.body;

    try {
        const newKehadiran = await kehadiranModel.create({
            student_id,
            jadwal_pelajaran_id,
            semester_tahun_ajaran_id,
            tanggal,
            status,
            keterangan,
        });

        res.status(201).json(newKehadiran);
    } catch (error) {
        console.error('Error creating Kehadiran:', error);
        res.status(500).json({ error: error.message });
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
        const kehadiran = await kehadiranModel.findByPk(id);

        if (!kehadiran) {
            return res.status(404).json({ message: 'Kehadiran not found' });
        }

        await kehadiran.update({
            student_id,
            jadwal_pelajaran_id,
            semester_tahun_ajaran_id,
            tanggal,
            status,
            keterangan,
        });

        res.status(200).json(kehadiran);
    } catch (error) {
        console.error('Error updating Kehadiran:', error);
        res.status(500).json({ error: error.message });
    }
};

// Delete a Kehadiran
const deleteKehadiran = async (req, res) => {
    const { id } = req.params;

    try {
        const kehadiran = await kehadiranModel.findByPk(id);

        if (!kehadiran) {
            return res.status(404).json({ message: 'Kehadiran not found' });
        }

        await kehadiran.destroy();
        res.status(200).json({ message: 'Kehadiran deleted successfully' });
    } catch (error) {
        console.error('Error deleting Kehadiran:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createKehadiran,
    getAllKehadiran,
    getKehadiranById,
    updateKehadiran,
    deleteKehadiran,
};
