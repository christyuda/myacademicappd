const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../src/config/dbConfig");

const Kelas = sequelize.define(
  "Kelas",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "teachers", // Nama tabel teachers
        key: "id",
      },
    },
    nama_kelas: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    tingkat: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    kapasitas: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Aktif", "Nonaktif"),
      defaultValue: "Aktif",
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
    tableName: "kelas",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Kelas;
