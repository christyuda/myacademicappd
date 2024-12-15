const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); // Ensure this path is correct

const Users = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
   
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Specify false if every user must have a role.
        defaultValue: 0 // Default role ID can be set if applicable, or remove if not using default.
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true 
        }
    },
    emailVerifiedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rememberToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    verificationCode: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'users',
    timestamps: true, // Enables createdAt and updatedAt management by Sequelize.
    updatedAt: 'updated_at',
    createdAt: 'created_at',
});

module.exports = Users;
