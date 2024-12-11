const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../src/config/dbConfig");

const StudentClasses = sequelize.define(
  "StudentClasses",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "students", // Nama tabel students
        key: "id",
      },
      onDelete: "CASCADE",
    },
    kelas_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "kelas", // Nama tabel kelas
        key: "id",
      },
      onDelete: "CASCADE",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "student_classes",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = StudentClasses;