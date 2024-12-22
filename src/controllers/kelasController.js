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
            return res.status(404).json({
                statusCode: 404,
                message: 'Teacher not found',
                data: null,
            });
        }

        // Create new kelas
        const newKelas = await kelasModel.create({
            teacher_id,
            nama_kelas,
            tingkat,
            kapasitas,
            status,
        });

        return res.status(201).json({
            statusCode: 201,
            message: 'Kelas created successfully',
            data: {
                id: newKelas.id,
                teacher_id: newKelas.teacher_id,
                nama_kelas: newKelas.nama_kelas,
                tingkat: newKelas.tingkat,
                kapasitas: newKelas.kapasitas,
                status: newKelas.status,
                created_at: newKelas.created_at,
                updated_at: newKelas.updated_at,
            },
        });
    } catch (error) {
        console.error('Error creating kelas:', error);
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            error: error.message,
        });
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
        // Cari kelas berdasarkan ID
        const kelas = await kelasModel.findByPk(id);
        if (!kelas) {
            return res.status(404).json({
                statusCode: 404,
                status: false,
                message: 'Kelas not found',
                data: null,
            });
        }

        // Update data kelas
        await kelas.update({
            teacher_id,
            nama_kelas,
            tingkat,
            kapasitas,
            status,
        });

        // Format respons setelah berhasil diupdate
        return res.status(200).json({
            statusCode: 200,
            status: true,
            message: 'Kelas updated successfully',
            data: {
                id: kelas.id,
                teacher_id: kelas.teacher_id,
                nama_kelas: kelas.nama_kelas,
                tingkat: kelas.tingkat,
                kapasitas: kelas.kapasitas,
                status: kelas.status,
                created_at: kelas.created_at,
                updated_at: kelas.updated_at,
            },
        });
    } catch (error) {
        console.error('Error updating kelas:', error);
        return res.status(500).json({
            statusCode: 500,
            status: false,
            message: 'Internal server error',
            error: error.message,
        });
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
