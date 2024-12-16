const Users = require('../models/Users');
const Students = require('../models/Students');
const Teachers = require('../models/Teachers');
const Kelas = require('../models/Kelas');

exports.getMetrics = async (req, res) => {
    try {
        // Hitung jumlah data
        const usersCount = await Users.count();
        const studentsCount = await Students.count();
        const teachersCount = await Teachers.count();
        const kelasCount = await Kelas.count();

        // Response JSON
        res.status(200).json({
            message: 'Metrics data fetched successfully',
            data: {
                users: usersCount,
                students: studentsCount,
                teachers: teachersCount,
                kelas: kelasCount
            }
        });
    } catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).json({
            message: 'Failed to fetch metrics data',
            error: error.message
        });
    }
};
