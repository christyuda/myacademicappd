const express = require('express');
const router = express.Router();
const { getMetrics } = require('../controllers/metricController'); // Controller
const verifyToken = require('../middleware/authMiddleware');

// Route untuk mendapatkan metric count data
router.get('/metrics',  verifyToken, getMetrics);

module.exports = router;
