const express = require('express');
const router = express.Router();
const {
    createTeacherFromUser,
    getAllTeachers,
    getTeacherById,
} = require('../controllers/teacherController'); // Sesuaikan path

router.post('/teachers', createTeacherFromUser);

// Route untuk mendapatkan semua teacher (dengan pagination)
router.get('/teachers', getAllTeachers);

// Route untuk mendapatkan teacher berdasarkan ID
router.get('/teachers/:id', getTeacherById);

module.exports = router;
