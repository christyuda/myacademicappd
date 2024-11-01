const express = require('express');
const router = express.Router();
const roleMenuController = require('../controllers/roleController');

router.post('/role-menus', roleMenuController.createRoleMenu);
router.get('/role-menus', roleMenuController.getAllRoleMenus);

module.exports = router;