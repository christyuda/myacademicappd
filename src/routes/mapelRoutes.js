const express = require('express');
const router = express.Router();
const {
    createMataPelajaran,
    getAllMataPelajaran,
    getMataPelajaranById,
    updateMataPelajaran,
    deleteMataPelajaran,
} = require('../controllers/MataPelajaranController');

// Define routes for Mata Pelajaran
router.post('/mataPelajaran', createMataPelajaran);
router.get('/mataPelajaran', getAllMataPelajaran);
router.get('/mataPelajaran/:id', getMataPelajaranById);
router.put('/mataPelajaran/:id', updateMataPelajaran);
router.delete('/mataPelajaran/:id', deleteMataPelajaran);

module.exports = router;
