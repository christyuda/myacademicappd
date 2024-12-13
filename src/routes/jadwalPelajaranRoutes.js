const express = require('express');
const router = express.Router();
const {
    createJadwalPelajaran,
    getAllJadwalPelajaran,
    getJadwalPelajaranById,
    updateJadwalPelajaran,
    deleteJadwalPelajaran,
} = require('../controllers/jadwalPelajaranController');

router.post('/jadwalPelajaran', createJadwalPelajaran);
router.get('/jadwalPelajaran', getAllJadwalPelajaran);
router.get('/jadwalPelajaran/:id', getJadwalPelajaranById);
router.put('/jadwalPelajaran/:id', updateJadwalPelajaran);
router.delete('/jadwalPelajaran/:id', deleteJadwalPelajaran);

module.exports = router;
