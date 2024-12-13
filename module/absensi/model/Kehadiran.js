const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../src/config/dbConfig");

const Kehadiran = sequelize.define(
  "Kehadiran",
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
    },
    semester_tahun_ajaran_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "semester_tahun_ajaran", // Nama tabel semester_tahun_ajaran
        key: "id",
      },
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Hadir", "Izin", "Sakit", "Alpa"),
      allowNull: false,
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    kelas_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "kelas", // Nama tabel kelas
        key: "id",
      },
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
    tableName: "kehadiran",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Kehadiran;
