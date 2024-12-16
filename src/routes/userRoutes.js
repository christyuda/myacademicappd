const express = require('express');
const router = express.Router();
const { 
    createUser, 
    assignRoleToUser, 
    getAllUsers, 
    getUserById, 
    updateUser, 
    deleteUser 
} = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/users',verifyToken, createUser);

router.post('/users/role',verifyToken, assignRoleToUser);

router.get('/users', verifyToken,getAllUsers);

router.get('/users/:id',verifyToken, getUserById);

router.put('/users/:id', verifyToken,updateUser);

router.delete('/users/:id',verifyToken, deleteUser);

module.exports = router;
