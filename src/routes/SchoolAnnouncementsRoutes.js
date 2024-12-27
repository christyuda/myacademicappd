const express = require('express');
const router = express.Router();
const schoolAnnouncementController = require('../controllers/schoolAnnouncementController');

// Create a new announcement
router.post('/announcements', schoolAnnouncementController.createAnnouncement);

// Get all announcements with pagination
router.get('/announcements', schoolAnnouncementController.getAllAnnouncements);

// Get a single announcement by ID
router.get('/announcements/:id', schoolAnnouncementController.getAnnouncementById);

// Update an announcement by ID
router.put('/announcements/:id', schoolAnnouncementController.updateAnnouncement);

// Delete an announcement by ID
router.delete('/announcements/:id', schoolAnnouncementController.deleteAnnouncement);

module.exports = router;
