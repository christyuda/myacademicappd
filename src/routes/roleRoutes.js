const express = require('express');
const roleController = require('../controllers/roleController');
const menuController = require('../controllers/menuController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/roles-add', verifyToken, roleController.createRole);
router.post('/roles',verifyToken, roleController.getAllRoles);
router.post('/roles/addToRole',verifyToken, menuController.addMenuToRole);
router.get('/roles/:roleId/menus',verifyToken, menuController.getMenusForRole);

module.exports = router;
