// Model: Kelas.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');
const Teacher = require('../models/Teachers');

const Kelas = sequelize.define('kelas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nama_kelas: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tingkat: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    kapasitas: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Aktif',
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
    tableName: 'kelas',
    timestamps: false,
});

Kelas.belongsTo(Teacher, { foreignKey: 'teacher_id', as: 'teacher' });

module.exports = Kelas;