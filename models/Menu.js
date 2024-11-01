const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/dbConfig');
const Role = require('./Role');  // Pastikan file ini mengimpor model Role dengan benar

const Menu = sequelize.define('Menu', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    menu_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Null for top-level menu
        defaultValue: 0
    },
    nama_menu: {
        type: DataTypes.STRING,
        allowNull: false
    },
    routes_page: {
        type: DataTypes.STRING,
        allowNull: false
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: true
    },
    sequence: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    parent_sequence: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
  tableName: 'menus',
  timestamps: true, // Mengaktifkan fitur timestamps
  createdAt: 'created_at', // Menyesuaikan nama kolom untuk createdAt
  updatedAt: 'updated_at' // Menyesuaikan nama kolom untuk updatedAt
});



module.exports = Menu;
