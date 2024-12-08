const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');
const Students = require('./Students'); // Import model Students
const SemesterTahunAjaran = require('./SemesterTahunAjaran'); // Import model SemesterTahunAjaran

const Kehadiran = sequelize.define('kehadiran', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Students,
            key: 'id',
        },
    },
    semester_tahun_ajaran_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: SemesterTahunAjaran,
            key: 'id',
        },
    },
    tanggal: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Hadir', 'Tidak Hadir', 'Izin', 'Sakit'),
        allowNull: false,
    },
    keterangan: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'kehadiran',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

// Relasi
Kehadiran.belongsTo(Students, { foreignKey: 'student_id', as: 'student' });
Kehadiran.belongsTo(SemesterTahunAjaran, { foreignKey: 'semester_tahun_ajaran_id', as: 'semester' });

module.exports = Kehadiran;
