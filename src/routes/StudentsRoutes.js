const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/studentsController');


router.post('/students', studentsController.createStudentFromUser); 
router.get('/students', studentsController.getAllStudents); 
router.get('/students/:id', studentsController.getStudentById); 

module.exports = router;