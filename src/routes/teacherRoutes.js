const express = require('express');
const router = express.Router();
const {
    createTeacherFromUser,
    getAllTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher,
} = require('../controllers/teacherController'); // Sesuaikan path
const verifyToken = require('../middleware/authMiddleware');

router.post('/teachers', verifyToken, createTeacherFromUser);

// Route untuk mendapatkan semua teacher (dengan pagination)
router.get('/teachers',verifyToken, getAllTeachers);

// Route untuk mendapatkan teacher berdasarkan ID
router.get('/teachers/:id',verifyToken, getTeacherById);
// Route untuk mengupdate teacher
router.put('/teachers/:id', verifyToken, updateTeacher);

// Route untuk menghapus teacher
router.delete('/teachers/:id', verifyToken, deleteTeacher);

module.exports = router;
