const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); // Sesuaikan path

const Tokens = sequelize.define('Token', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: { // Sesuai dengan kolom di tabel
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Nama tabel Users (lowercase sesuai di database)
            key: 'id',      // Primary key dari tabel users
        },
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    access_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'tokens', // Pastikan nama tabel sesuai
    timestamps: false, // Karena `created_at` dan `updated_at` sudah didefinisikan
});

module.exports = Tokens;
