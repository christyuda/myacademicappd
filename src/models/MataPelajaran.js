const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const MataPelajaran = sequelize.define('mata_pelajaran', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nama_pelajaran: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    kode_pelajaran: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure kode_pelajaran is unique
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
    tableName: 'mata_pelajaran',
    timestamps: false, // Disable default Sequelize timestamps
});

module.exports = MataPelajaran;
