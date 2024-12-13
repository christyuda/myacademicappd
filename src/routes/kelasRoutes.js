// Routes: kelasRoutes.js
const express = require('express');
const router = express.Router();
const { createKelas, getAllKelas, getKelasById,updateKelas,deleteKelas } = require('../controllers/KelasController');

router.post('/kelas', createKelas);
router.get('/kelas', getAllKelas);
router.get('/kelas/:id', getKelasById);
router.put('/kelas/:id', updateKelas);
router.delete('/kelas/:id', deleteKelas);

module.exports = router;
