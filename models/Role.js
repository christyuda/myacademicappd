const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/dbConfig'); // Pastikan path ke dbConfig benar

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true // asumsi role_id adalah auto increment
    },
    rolename: {
        type: DataTypes.STRING,
        allowNull: false
    },
    desc: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
    , created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW  // Menggunakan NOW untuk nilai default
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW  // Menggunakan NOW untuk nilai default
    }
}, {
    // Opsional: Sequelize options
    tableName: 'roles',
    timestamps: true,
    created_at: 'created_at',
    updated_at: 'updated_at'
});

module.exports = Role;
