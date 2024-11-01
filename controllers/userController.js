const userModel = require('../models/userModel');

// Controller to handle creating a user
const createUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await userModel.createUser(username, email, password);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller to assign a role to a user
const assignRoleToUser = async (req, res) => {
    const { roleId } = req.body;
    const userId = req.params.userId;

    try {
        const userRole = await userModel.assignRoleToUser(userId, roleId);
        res.status(201).json(userRole);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createUser,
    assignRoleToUser
};
