const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Path sesuai dengan lokasi authController Anda

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/send-verification-email', authController.sendVerificationEmail);
router.post('/verify-email-code', authController.verifyEmailCode);
module.exports = router;
