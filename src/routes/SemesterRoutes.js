const express = require('express');
const semesterController = require('../controllers/semesterController');
const router = express.Router();

router.post('/semester/list', semesterController.getAllWithPost);
router.get('/semester/:id', semesterController.getById);
router.post('/semester', semesterController.create);
router.put('/semester/:id', semesterController.update);
router.delete('/semester/:id', semesterController.delete);

module.exports = router;
