const express = require('express');
const router = express.Router();
const {
    createMataPelajaran,
    getAllMataPelajaran,
    getMataPelajaranById,
    updateMataPelajaran,
    deleteMataPelajaran,
} = require('../controllers/MataPelajaranController');
const verifyToken = require('../middleware/authMiddleware');

// Define routes for Mata Pelajaran
router.post('/mataPelajaran',verifyToken, createMataPelajaran);
router.get('/mataPelajaran', verifyToken,getAllMataPelajaran);
router.get('/mataPelajaran/:id',verifyToken, getMataPelajaranById);
router.put('/mataPelajaran/:id', verifyToken,updateMataPelajaran);
router.delete('/mataPelajaran/:id', verifyToken,deleteMataPelajaran);

module.exports = router;
