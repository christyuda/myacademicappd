const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../src/config/dbConfig");

const Students = sequelize.define(
  "Students",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nis: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    nama_lengkap: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    tempat_lahir: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    tanggal_lahir: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    jenis_kelamin: {
      type: DataTypes.ENUM("L", "P"),
      allowNull: false,
    },
    agama: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    no_telepon: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tanggal_masuk: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Aktif", "Lulus", "Pindah", "Dropout"),
      allowNull: true,
      defaultValue: "Aktif",
    },
    catatan_khusus: {
      type: DataTypes.TEXT,
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
  },
  {
    tableName: "students",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Students;
