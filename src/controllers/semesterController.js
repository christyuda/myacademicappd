const SemesterTahunAjaran = require('../models/SemesterTahunAjaran'); 
const { getPagination, getPagingData, buildConditions } = require('../utils/paginationHelper');

// Get all with POST and pagination
exports.getAllWithPost = async (req, res) => {
    try {
        const { page, size, term, startDate, endDate } = req.body;
        const { limit, offset } = getPagination(page, size);

        const conditions = buildConditions({ startDate, endDate, term });

        const data = await SemesterTahunAjaran.findAndCountAll({
            where: conditions,
            limit,
            offset,
        });

        const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
        const response = getPagingData(data, page, limit, baseUrl);

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
};

// Get by ID
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const semester = await SemesterTahunAjaran.findByPk(id);

        if (!semester) {
            return res.status(404).json({ message: 'Data not found' });
        }

        res.status(200).json(semester);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
};

// Create// Create
exports.create = async (req, res) => {
    try {
        const { tahun_ajaran, semester, status } = req.body;

        if (!tahun_ajaran || !semester || !status) {
            return res.status(400).json({
                status: false,
                code: 'VALIDATION_ERROR',
                message: 'All fields are required: tahun_ajaran, semester, status',
                error: null,
                statusCode: 400
            });
        }

        const newSemester = await SemesterTahunAjaran.create({
            tahun_ajaran,
            semester,
            status,
        });

        res.status(201).json({
            status: true,
            code: 'SUCCESS',
            message: 'Data created successfully',
            data: newSemester,
            error: null,
            statusCode: 201
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 'SERVER_ERROR',
            message: 'Error creating data',
            error: error.message,
            statusCode: 500
        });
    }
};

// Update
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { tahun_ajaran, semester, status } = req.body;

        if (!tahun_ajaran || !semester || !status) {
            return res.status(400).json({
                status: false,
                code: 'VALIDATION_ERROR',
                message: 'All fields are required: tahun_ajaran, semester, status',
                error: null,
                statusCode: 400
            });
        }

        const semesterRecord = await SemesterTahunAjaran.findByPk(id);

        if (!semesterRecord) {
            return res.status(404).json({
                status: false,
                code: 'NOT_FOUND',
                message: 'Data not found',
                error: null,
                statusCode: 404
            });
        }

        await semesterRecord.update({
            tahun_ajaran,
            semester,
            status,
        });

        res.status(200).json({
            status: true,
            code: 'SUCCESS',
            message: 'Data updated successfully',
            data: semesterRecord,
            error: null,
            statusCode: 200
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 'SERVER_ERROR',
            message: 'Error updating data',
            error: error.message,
            statusCode: 500
        });
    }
};

// Delete
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const semesterRecord = await SemesterTahunAjaran.findByPk(id);

        if (!semesterRecord) {
            return res.status(404).json({
                status: false,
                code: 'NOT_FOUND',
                message: 'Data not found',
                error: null,
                statusCode: 404
            });
        }

        await semesterRecord.destroy();

        res.status(200).json({
            status: true,
            code: 'SUCCESS',
            message: 'Data deleted successfully',
            error: null,
            statusCode: 200
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 'SERVER_ERROR',
            message: 'Error deleting data',
            error: error.message,
            statusCode: 500
        });
    }
};
