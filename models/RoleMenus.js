// models/RoleMenu.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const RoleMenu = sequelize.define('RoleMenu', {
    id: {
        type: DataTypes.BIGINT,  // Menggunakan BIGINT sesuai definisi kolom di DB
        primaryKey: true,        // Menandakan sebagai Primary Key
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {             // Menetapkan foreign key relationship
            model: 'roles',       // 'roles' adalah nama tabel roles
            key: 'id'             // 'id' adalah kolom di tabel roles yang dijadikan referensi
        }
    },
    menu_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {             // Menetapkan foreign key relationship
            model: 'menus',       // 'menus' adalah nama tabel menus
            key: 'id'             // 'id' adalah kolom di tabel menus yang dijadikan referensi
        }
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true           // Mengizinkan null jika tidak ada parent
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW  // Menggunakan NOW untuk nilai default
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW  // Menggunakan NOW untuk nilai default
    }
}, {
    tableName: 'rolemenus',
    timestamps: true  // Mengaktifkan fitur timestamps Sequelize
});

module.exports = RoleMenu;
