const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/dbConfig');

const RoleMenu = sequelize.define('RoleMenu', {
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    menu_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    created_at: { // Gunakan nama kolom yang sesuai dengan tabel di database
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: { // Gunakan nama kolom yang sesuai dengan tabel di database
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'rolemenus', // Sesuaikan dengan nama tabel di database Anda
    timestamps: false // Matikan pengaturan timestamps default
});

module.exports = RoleMenu;
