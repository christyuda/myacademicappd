const jadwalPelajaranModel = require('../models/JadwalPelajaran');
const { getPagination, getPagingData } = require('../utils/paginationHelper');

// Create a new Jadwal Pelajaran
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

        res.status(201).json(newJadwalPelajaran);
    } catch (error) {
        console.error('Error creating Jadwal Pelajaran:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get all Jadwal Pelajaran with pagination
const getAllJadwalPelajaran = async (req, res) => {
    const { page = 1, size = 10 } = req.query;
    const { limit, offset } = getPagination(page, size);

    try {
        const data = await jadwalPelajaranModel.findAndCountAll({
            limit,
            offset,
            order: [['created_at', 'DESC']],
        });

        const response = getPagingData(data, page, limit, '/api/jadwalPelajaran');
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching Jadwal Pelajaran:', error);
        res.status(500).json({ error: error.message });
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
            return res.status(404).json({ message: 'Jadwal Pelajaran not found' });
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

        res.status(200).json(jadwalPelajaran);
    } catch (error) {
        console.error('Error updating Jadwal Pelajaran:', error);
        res.status(500).json({ error: error.message });
    }
};

// Delete a Jadwal Pelajaran
const deleteJadwalPelajaran = async (req, res) => {
    const { id } = req.params;

    try {
        const jadwalPelajaran = await jadwalPelajaranModel.findByPk(id);

        if (!jadwalPelajaran) {
            return res.status(404).json({ message: 'Jadwal Pelajaran not found' });
        }

        await jadwalPelajaran.destroy();
        res.status(200).json({ message: 'Jadwal Pelajaran deleted successfully' });
    } catch (error) {
        console.error('Error deleting Jadwal Pelajaran:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createJadwalPelajaran,
    getAllJadwalPelajaran,
    getJadwalPelajaranById,
    updateJadwalPelajaran,
    deleteJadwalPelajaran,
};
