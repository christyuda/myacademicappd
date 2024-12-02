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

router.post('/users', createUser);

router.post('/users/role', assignRoleToUser);

router.get('/users', getAllUsers);

router.get('/users/:id', getUserById);

router.put('/users/:id', updateUser);

router.delete('/users/:id', deleteUser);

module.exports = router;
