const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); // Sesuaikan path
const Users = require('./Users');
const Students = sequelize.define('students', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nis: {
        type: DataTypes.STRING,
        allowNull: false,
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
        validate: {
            isEmail: true, // Validasi email
        },
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users,
            key: 'id',
        },
    },
    tanggal_masuk: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('Aktif', 'Lulus', 'Pindah', 'Dropout'),
        allowNull: false,
        defaultValue: 'Aktif', // Nilai default
    },
    catatan_khusus: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'students', // Pastikan nama tabel sesuai
    timestamps: true, // Aktifkan timestamps (createdAt dan updatedAt)
    createdAt: 'created_at', // Mapping ke nama kolom yang benar
    updatedAt: 'updated_at', // Mapping ke nama kolom yang benar
});

Students.belongsTo(Users, { foreignKey: 'user_id', as: 'user' });
Users.hasOne(Students, { foreignKey: 'user_id', as: 'student' });


module.exports = Students;
