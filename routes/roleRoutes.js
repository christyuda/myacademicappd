const express = require('express');
const roleController = require('../controllers/roleController');
const menuController = require('../controllers/menuController');
const router = express.Router();

router.post('/roles-add', roleController.createRole);
router.post('/roles', roleController.getAllRoles);
router.post('/roles/:roleId/menus', menuController.addMenuToRole);
router.get('/roles/:roleId/menus', menuController.getMenusForRole);

module.exports = router;
