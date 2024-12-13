const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const JadwalPelajaran = sequelize.define('jadwal_pelajaran', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    kelas_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    mata_pelajaran_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    semester_tahun_ajaran_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    hari: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    jam_mulai: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    jam_selesai: {
        type: DataTypes.TIME,
        allowNull: false,
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
    tableName: 'jadwal_pelajaran',
    timestamps: false,
});

module.exports = JadwalPelajaran;
