const express = require('express');
const studentClassController = require('../controllers/studentClassesController');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

router.post('/student-classes',verifyToken, studentClassController.createStudentClass); // Create
router.post('/student-classes/bulk',verifyToken, studentClassController.bulkCreateStudentInClass); // Create bulk
router.get('/student-classes/:kelas_id',verifyToken, studentClassController.getStudentsByClass); // Read
router.put('/student-classes/:id',verifyToken, studentClassController.updateStudentClass); // Update
router.delete('/student-classes/:id', verifyToken, studentClassController.removeStudentFromClass); // Delete
router.get('/student-classes-teachers/:kelas_id/schedules/:jadwal_pelajaran_id', studentClassController.getStudentsByTeachers);

module.exports = router;
