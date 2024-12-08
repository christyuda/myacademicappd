const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); // Sesuaikan path ke konfigurasi database
const Users = require('./Users');

const Teacher = sequelize.define('teachers', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nip: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // NIP harus unik
    },
    nama_lengkap: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tempat_lahir: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tanggal_lahir: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    jenis_kelamin: {
        type: DataTypes.ENUM('L', 'P'),
        allowNull: false,
    },
    agama: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    alamat: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    no_telepon: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tanggal_masuk: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('Aktif', 'Nonaktif', 'Pensiun'),
        defaultValue: 'Aktif',
    },
    catatan_khusus: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    is_wali_kelas: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // Default bukan wali kelas
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
    tableName: 'teachers',
    timestamps: false, // Karena Anda sudah menggunakan `created_at` dan `updated_at`
});

// Relasi dengan Users
Teacher.belongsTo(Users, { foreignKey: 'user_id', as: 'user' });

module.exports = Teacher;
