const express = require('express');
const router = express.Router();
const {
    createKehadiran,
    getAllKehadiran,
    getKehadiranById,
    updateKehadiran,
    deleteKehadiran,
} = require('../controllers/kehadiranController');

router.post('/kehadiran', createKehadiran);
router.get('/kehadiran', getAllKehadiran);
router.get('/kehadiran/:id', getKehadiranById);
router.put('/kehadiran/:id', updateKehadiran);
router.delete('/kehadiran/:id', deleteKehadiran);

module.exports = router;
