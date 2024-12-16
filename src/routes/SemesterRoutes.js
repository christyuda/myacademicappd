const express = require('express');
const semesterController = require('../controllers/semesterController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/semester/list', verifyToken, semesterController.getAllWithPost);
router.get('/semester/:id',verifyToken, semesterController.getById);
router.post('/semester',verifyToken, semesterController.create);
router.put('/semester/:id',verifyToken, semesterController.update);
router.delete('/semester/:id', verifyToken,semesterController.delete);

module.exports = router;
