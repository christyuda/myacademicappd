const express = require('express');
const router = express.Router();
const {
    createKehadiran,
    getAllKehadiran,
    getKehadiranById,
    updateKehadiran,
    deleteKehadiran,
} = require('../controllers/kehadiranController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/kehadiran',verifyToken, createKehadiran);
router.get('/kehadiran', verifyToken,getAllKehadiran);
router.get('/kehadiran/:id',verifyToken, getKehadiranById);
router.put('/kehadiran/:id', verifyToken,updateKehadiran);
router.delete('/kehadiran/:id',verifyToken, deleteKehadiran);

module.exports = router;
