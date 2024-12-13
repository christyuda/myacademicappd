const kelasModel = require('../models/Kelas');
const teacherModel = require('../models/Teachers');
const { getPagination, getPagingData } = require('../utils/paginationHelper'); // Helper for pagination

// Create a new Kelas
const createKelas = async (req, res) => {
    const { teacher_id, nama_kelas, tingkat, kapasitas, status } = req.body;

    try {
        // Check if the teacher exists
        const teacher = await teacherModel.findByPk(teacher_id);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Create new kelas
        const newKelas = await kelasModel.create({
            teacher_id,
            nama_kelas,
            tingkat,
            kapasitas,
            status,
        });

        res.status(201).json(newKelas);
    } catch (error) {
        console.error('Error creating kelas:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get all Kelas with pagination
const getAllKelas = async (req, res) => {
    const { page = 1, size = 10 } = req.query;
    const { limit, offset } = getPagination(page, size);

    try {
        // Fetch data with pagination
        const data = await kelasModel.findAndCountAll({
            limit,
            offset,
            include: [
                {
                    model: teacherModel,
                    as: 'teacher',
                    attributes: ['nama_lengkap'], // Include teacher's name
                },
            ],
            order: [['created_at', 'DESC']],
        });

        const response = getPagingData(data, page, limit, '/api/kelas');
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching kelas:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get a single Kelas by ID
const getKelasById = async (req, res) => {
    const { id } = req.params;

    try {
        const kelas = await kelasModel.findByPk(id, {
            include: [
                {
                    model: teacherModel,
                    as: 'teacher',
                    attributes: ['nama_lengkap'], // Include teacher's name
                },
            ],
        });

        if (!kelas) {
            return res.status(404).json({ message: 'Kelas not found' });
        }

        res.status(200).json(kelas);
    } catch (error) {
        console.error('Error fetching kelas:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update a Kelas
const updateKelas = async (req, res) => {
    const { id } = req.params;
    const { teacher_id, nama_kelas, tingkat, kapasitas, status } = req.body;

    try {
        const kelas = await kelasModel.findByPk(id);
        if (!kelas) {
            return res.status(404).json({ message: 'Kelas not found' });
        }

        // Update Kelas
        await kelas.update({
            teacher_id,
            nama_kelas,
            tingkat,
            kapasitas,
            status,
        });

        res.status(200).json(kelas);
    } catch (error) {
        console.error('Error updating kelas:', error);
        res.status(500).json({ error: error.message });
    }
};

// Delete a Kelas
const deleteKelas = async (req, res) => {
    const { id } = req.params;

    try {
        const kelas = await kelasModel.findByPk(id);
        if (!kelas) {
            return res.status(404).json({ message: 'Kelas not found' });
        }

        // Delete Kelas
        await kelas.destroy();
        res.status(200).json({ message: 'Kelas deleted successfully' });
    } catch (error) {
        console.error('Error deleting kelas:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createKelas,
    getAllKelas,
    getKelasById,
    updateKelas,
    deleteKelas,
};
