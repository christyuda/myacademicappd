const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');


const Kehadiran = sequelize.define('kehadiran', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    jadwal_pelajaran_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    semester_tahun_ajaran_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tanggal: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Hadir', 'Izin', 'Sakit', 'Alfa'),
        allowNull: false,
    },
    keterangan: {
        type: DataTypes.STRING,
        allowNull: true,
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
    tableName: 'kehadiran',
    timestamps: false,
});

module.exports = Kehadiran;
