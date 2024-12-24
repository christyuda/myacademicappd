const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');
const Students = require('./Students'); // Import model Students
const Kelas = require('./Kelas'); // Import model Kelas

const StudentClass = sequelize.define('student_classes', {
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
    kelas_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Kelas,
            key: 'id',
        },
    },
}, {
    tableName: 'student_classes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

// Define associations
StudentClass.belongsTo(Students, { foreignKey: 'student_id', as: 'student' });
Students.hasMany(StudentClass, { foreignKey: 'student_id', as: 'classes' });

StudentClass.belongsTo(Kelas, { foreignKey: 'kelas_id', as: 'kelas' });
Kelas.hasMany(StudentClass, { foreignKey: 'kelas_id', as: 'students' });

module.exports = StudentClass;
