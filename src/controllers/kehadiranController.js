const Kehadiran = require('../models/Kehadiran');
const Students = require('../models/Students');
const SemesterTahunAjaran = require('../models/SemesterTahunAjaran');

// Menambahkan kehadiran
const addKehadiran = async (req, res) => {
    const { student_id, semester_tahun_ajaran_id, tanggal, status, keterangan } = req.body;

    try {
        const kehadiran = await Kehadiran.create({
            student_id,
            semester_tahun_ajaran_id,
            tanggal,
            status,
            keterangan,
        });

        res.status(201).json(kehadiran);
    } catch (error) {
        console.error('Error adding kehadiran:', error);
        res.status(500).json({ error: error.message });
    }
};

// Mendapatkan semua data kehadiran
const getAllKehadiran = async (req, res) => {
    try {
        const kehadiran = await Kehadiran.findAll({
            include: [
                { model: Students, as: 'student', attributes: ['nama_lengkap', 'nis'] },
                { model: SemesterTahunAjaran, as: 'semester', attributes: ['tahun_ajaran', 'semester'] },
            ],
        });

        res.status(200).json(kehadiran);
    } catch (error) {
        console.error('Error fetching kehadiran:', error);
        res.status(500).json({ error: error.message });
    }
};

// Mendapatkan data kehadiran berdasarkan ID
const getKehadiranById = async (req, res) => {
    const { id } = req.params;

    try {
        const kehadiran = await Kehadiran.findByPk(id, {
            include: [
                { model: Students, as: 'student', attributes: ['nama_lengkap', 'nis'] },
                { model: SemesterTahunAjaran, as: 'semester', attributes: ['tahun_ajaran', 'semester'] },
            ],
        });

        if (!kehadiran) {
            return res.status(404).json({ message: 'Kehadiran not found' });
        }

        res.status(200).json(kehadiran);
    } catch (error) {
        console.error('Error fetching kehadiran:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addKehadiran,
    getAllKehadiran,
    getKehadiranById,
};
