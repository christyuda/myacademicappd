const express = require('express');
const router = express.Router();
const {
    createJadwalPelajaran,
    getAllJadwalPelajaran,
    getJadwalPelajaranById,
    updateJadwalPelajaran,
    deleteJadwalPelajaran,
    getJadwalPelajaranByUser,
} = require('../controllers/jadwalPelajaranController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/jadwalPelajaran', verifyToken, createJadwalPelajaran);
router.get('/jadwalPelajaran', verifyToken, getAllJadwalPelajaran);
router.get('/jadwalPelajaran/:id',verifyToken, getJadwalPelajaranById);
router.put('/jadwalPelajaran/:id', verifyToken, updateJadwalPelajaran);
router.delete('/jadwalPelajaran/:id', verifyToken, deleteJadwalPelajaran);
router.get('/jadwalPelajaranGuru', verifyToken, getJadwalPelajaranByUser);


module.exports = router;
