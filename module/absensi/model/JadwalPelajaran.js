const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../src/config/dbConfig");

const JadwalPelajaran = sequelize.define(
  "JadwalPelajaran",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kelas_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "kelas", // Nama tabel kelas
        key: "id",
      },
    },
    mata_pelajaran_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "mata_pelajaran", // Nama tabel mata_pelajaran
        key: "id",
      },
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "teachers", // Nama tabel teachers
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
    hari: {
      type: DataTypes.ENUM("Senin", "Selasa", "Rabu", "Kamis", "Jumat"),
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
  },
  {
    tableName: "jadwal_pelajaran",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = JadwalPelajaran;
