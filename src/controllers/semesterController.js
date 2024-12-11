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

// Create
exports.create = async (req, res) => {
    try {
        const { tahun_ajaran, semester, status } = req.body;

        if (!tahun_ajaran || !semester || !status) {
            return res.status(400).json({ message: 'All fields are required: tahun_ajaran, semester, status' });
        }

        const newSemester = await SemesterTahunAjaran.create({
            tahun_ajaran,
            semester,
            status,
        });

        res.status(201).json({ message: 'Data created successfully', data: newSemester });
    } catch (error) {
        res.status(500).json({ message: 'Error creating data', error: error.message });
    }
};

// Update
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { tahun_ajaran, semester, status } = req.body;

        if (!tahun_ajaran || !semester || !status) {
            return res.status(400).json({ message: 'All fields are required: tahun_ajaran, semester, status' });
        }

        const semesterRecord = await SemesterTahunAjaran.findByPk(id);

        if (!semesterRecord) {
            return res.status(404).json({ message: 'Data not found' });
        }

        await semesterRecord.update({
            tahun_ajaran,
            semester,
            status,
        });

        res.status(200).json({ message: 'Data updated successfully', data: semesterRecord });
    } catch (error) {
        res.status(500).json({ message: 'Error updating data', error: error.message });
    }
};

// Delete
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const semesterRecord = await SemesterTahunAjaran.findByPk(id);

        if (!semesterRecord) {
            return res.status(404).json({ message: 'Data not found' });
        }

        await semesterRecord.destroy();

        res.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting data', error: error.message });
    }
};
