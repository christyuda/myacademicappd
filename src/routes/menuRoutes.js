const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.post('/menus/create-parent', menuController.createParentMenu);
router.post('/menus/create-child', menuController.createChildMenu);
router.post('/menus', menuController.getAllMenusWithParent);

module.exports = router;
