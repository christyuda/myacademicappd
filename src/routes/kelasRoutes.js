// Routes: kelasRoutes.js
const express = require('express');
const router = express.Router();
const { createKelas, getAllKelas, getKelasById,updateKelas,deleteKelas } = require('../controllers/KelasController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/kelas',verifyToken, createKelas);
router.get('/kelas', verifyToken,getAllKelas);
router.get('/kelas/:id', verifyToken,getKelasById);
router.put('/kelas/:id',verifyToken, updateKelas);
router.delete('/kelas/:id', verifyToken,deleteKelas);

module.exports = router;
