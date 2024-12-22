const express = require('express');
const router = express.Router();
const roleMenuController = require('../controllers/roleController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/role-menus', verifyToken, roleMenuController.createRoleMenu);
router.post('/roles/getAllRoleMenus', verifyToken,roleMenuController.getAllRoleMenus);
router.post('/roles/getRoleMenuData', verifyToken,roleMenuController.getRoleMenuData);

module.exports = router;