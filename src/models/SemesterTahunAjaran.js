const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const SemesterTahunAjaran = sequelize.define('SemesterTahunAjaran', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tahun_ajaran: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    semester: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_at: { // Sesuaikan nama kolom dengan tabel di database
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: { // Sesuaikan nama kolom dengan tabel di database
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'semester_tahun_ajaran', // Nama tabel di database
    timestamps: false, // Matikan pengaturan timestamps default
    underscored: true, // Gunakan snake_case untuk nama kolom
});

module.exports = SemesterTahunAjaran;
