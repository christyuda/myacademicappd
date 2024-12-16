const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/menus/create-parent', verifyToken, menuController.createParentMenu);
router.post('/menus/create-child',verifyToken, menuController.createChildMenu);
router.post('/menus/create-parent', verifyToken,menuController.createParentMenu);
router.post('/menus/create-child',verifyToken, menuController.createChildMenu);
router.post('/menus',verifyToken, menuController.getAllMenusWithParent);

module.exports = router;
