const express = require('express');
const router = express.Router();
const { addKehadiran, getAllKehadiran, getKehadiranById } = require('../controllers/kehadiranController');

// Tambah kehadiran
router.post('/', addKehadiran);

// Get semua kehadiran
router.get('/', getAllKehadiran);

// Get kehadiran berdasarkan ID
router.get('/:id', getKehadiranById);

module.exports = router;
