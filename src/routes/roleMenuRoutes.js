const express = require('express');
const router = express.Router();
const roleMenuController = require('../controllers/roleController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/role-menus', verifyToken, roleMenuController.createRoleMenu);
router.get('/role-menus', verifyToken,roleMenuController.getAllRoleMenus);

module.exports = router;