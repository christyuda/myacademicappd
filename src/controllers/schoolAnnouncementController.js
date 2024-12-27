const SchoolAnnouncement = require('../models/SchoolAnnouncements');
const { getPagination, getPagingData } = require('../utils/paginationHelper');

// Create a new Announcement
const createAnnouncement = async (req, res) => {
    const { title, description, category, start_date, end_date, is_active } = req.body;

    // Validasi input
    if (!title || !category || !start_date || !end_date) {
        return res.status(400).json({
            statusCode: 400,
            message: 'Title, category, start_date, and end_date are required',
        });
    }

    // Jika description tidak diberikan, generate otomatis berdasarkan tanggal
    let generatedDescription = description;
    if (!description) {
        generatedDescription = `Pengumuman: ${title} akan berlangsung dari ${start_date} sampai ${end_date}.`;
    }

    try {
        // Buat pengumuman baru
        const newAnnouncement = await SchoolAnnouncement.create({
            title,
            description: generatedDescription,
            category,
            start_date,
            end_date,
            is_active: is_active !== undefined ? is_active : 1, // Default is_active to 1 if not provided
        });

        return res.status(201).json({
            statusCode: 201,
            message: 'Announcement created successfully',
            data: newAnnouncement,
        });
    } catch (error) {
        console.error('Error creating announcement:', error);
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};


// Get all Announcements with pagination
const getAllAnnouncements = async (req, res) => {
    const { page = 1, size = 10 } = req.query;
    const { limit, offset } = getPagination(page, size);

    try {
        const data = await SchoolAnnouncement.findAndCountAll({
            limit,
            offset,
            order: [['created_at', 'DESC']],
        });

        const response = getPagingData(data, page, limit, '/api/announcements');

        return res.status(200).json({
            statusCode: 200,
            message: 'Announcements retrieved successfully',
            ...response,
        });
    } catch (error) {
        console.error('Error fetching announcements:', error);
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Get a single Announcement by ID
const getAnnouncementById = async (req, res) => {
    const { id } = req.params;

    try {
        const announcement = await SchoolAnnouncement.findByPk(id);

        if (!announcement) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Announcement not found',
                data: null,
            });
        }

        return res.status(200).json({
            statusCode: 200,
            message: 'Announcement retrieved successfully',
            data: announcement,
        });
    } catch (error) {
        console.error('Error fetching announcement:', error);
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Update an Announcement
const updateAnnouncement = async (req, res) => {
    const { id } = req.params;
    const { title, description, category, start_date, end_date, is_active } = req.body;

    try {
        const announcement = await SchoolAnnouncement.findByPk(id);
        if (!announcement) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Announcement not found',
                data: null,
            });
        }

        await announcement.update({
            title,
            description,
            category,
            start_date,
            end_date,
            is_active,
        });

        return res.status(200).json({
            statusCode: 200,
            message: 'Announcement updated successfully',
            data: announcement,
        });
    } catch (error) {
        console.error('Error updating announcement:', error);
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Delete an Announcement
const deleteAnnouncement = async (req, res) => {
    const { id } = req.params;

    try {
        const announcement = await SchoolAnnouncement.findByPk(id);
        if (!announcement) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Announcement not found',
                data: null,
            });
        }

        await announcement.destroy();

        return res.status(200).json({
            statusCode: 200,
            message: 'Announcement deleted successfully',
            data: null,
        });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

module.exports = {
    createAnnouncement,
    getAllAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement,
};
