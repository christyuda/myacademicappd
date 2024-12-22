const mataPelajaranModel = require('../models/MataPelajaran');
const { getPagination, getPagingData } = require('../utils/paginationHelper');

const createMataPelajaran = async (req, res) => {
    const { nama_pelajaran, kode_pelajaran } = req.body;

    try {
        const newMataPelajaran = await mataPelajaranModel.create({
            nama_pelajaran,
            kode_pelajaran,
        });

        res.status(201).json({
            status: true,
            code: "SUCCESS",
            message: "Mata Pelajaran created successfully",
            data: newMataPelajaran,
            error: null,
            statusCode: 201,
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // Handle unique constraint error
            return res.status(400).json({
                status: false,
                code: "BAD_REQUEST",
                message: "Kode pelajaran already exists. Please use a unique value.",
                data: null,
                error: error.message,
                statusCode: 400,
            });
        }
        console.error('Error creating Mata Pelajaran:', error);
        res.status(500).json({
            status: false,
            code: "SERVER_ERROR",
            message: "Failed to create Mata Pelajaran",
            data: null,
            error: error.message,
            statusCode: 500,
        });
    }
};



// Get all Mata Pelajaran with pagination
const getAllMataPelajaran = async (req, res) => {
    const { page = 1, size = 10 } = req.query;
    const { limit, offset } = getPagination(page, size);

    try {
        const data = await mataPelajaranModel.findAndCountAll({
            limit,
            offset,
            order: [['created_at', 'DESC']],
        });

        const response = getPagingData(data, page, limit, '/api/mataPelajaran');
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching Mata Pelajaran:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get a single Mata Pelajaran by ID
const getMataPelajaranById = async (req, res) => {
    const { id } = req.params;

    try {
        const mataPelajaran = await mataPelajaranModel.findByPk(id);

        if (!mataPelajaran) {
            return res.status(404).json({ message: 'Mata Pelajaran not found' });
        }

        res.status(200).json(mataPelajaran);
    } catch (error) {
        console.error('Error fetching Mata Pelajaran:', error);
        res.status(500).json({ error: error.message });
    }
};
const updateMataPelajaran = async (req, res) => {
    const { id } = req.params;
    const { nama_pelajaran, kode_pelajaran } = req.body;

    try {
        const mataPelajaran = await mataPelajaranModel.findByPk(id);

        if (!mataPelajaran) {
            return res.status(404).json({
                status: false,
                code: "NOT_FOUND",
                message: "Mata Pelajaran not found",
                data: null,
                error: null,
                statusCode: 404,
            });
        }

        await mataPelajaran.update({
            nama_pelajaran,
            kode_pelajaran,
        });

        res.status(200).json({
            status: true,
            code: "SUCCESS",
            message: "Mata Pelajaran updated successfully",
            data: mataPelajaran,
            error: null,
            statusCode: 200,
        });
    } catch (error) {
        console.error('Error updating Mata Pelajaran:', error);
        res.status(500).json({
            status: false,
            code: "SERVER_ERROR",
            message: "Failed to update Mata Pelajaran",
            data: null,
            error: error.message,
            statusCode: 500,
        });
    }
};

// Delete a Mata Pelajaran
const deleteMataPelajaran = async (req, res) => {
    const { id } = req.params;

    try {
        const mataPelajaran = await mataPelajaranModel.findByPk(id);

        if (!mataPelajaran) {
            return res.status(404).json({
                status: false,
                code: 'NOT_FOUND',
                message: 'Mata Pelajaran not found',
                error: null,
                statusCode: 404
            });
        }

        // Delete Mata Pelajaran
        await mataPelajaran.destroy();
        res.status(200).json({
            status: true,
            code: 'SUCCESS',
            message: 'Mata Pelajaran deleted successfully',
            error: null,
            statusCode: 200
        });
    } catch (error) {
        console.error('Error deleting Mata Pelajaran:', error);
        res.status(500).json({
            status: false,
            code: 'SERVER_ERROR',
            message: 'Error occurred while deleting Mata Pelajaran',
            error: error.message,
            statusCode: 500
        });
    }
};


module.exports = {
    createMataPelajaran,
    getAllMataPelajaran,
    getMataPelajaranById,
    updateMataPelajaran,
    deleteMataPelajaran,
};
