const express = require('express');
const router = express.Router();
const absensiController = require('../controller/absensiController');

router.get('/mapel/absensi', absensiController.mapel)
router.get('/absensi/:kelas_id/:mata_pelajaran_id', absensiController.getAbsensiData)
router.post('/absensi/:student_id/:kelas_id/:semester_tahun_ajaran_id', absensiController.AbsensiStudent)

module.exports = router;