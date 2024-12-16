const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/studentsController');
const verifyToken = require('../middleware/authMiddleware');


router.post('/students', verifyToken, studentsController.createStudentFromUser); 
router.get('/students',verifyToken, studentsController.getAllStudents); 
router.get('/students/:id',verifyToken, studentsController.getStudentById); 

module.exports = router;