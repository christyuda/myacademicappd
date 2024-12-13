const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../src/config/dbConfig");

const Teacher = sequelize.define(
  "Teacher",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nip: {
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
      type: DataTypes.DATEONLY,
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
      references: {
        model: "Users",
        key: "id",
      },
    },
    tanggal_masuk: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Aktif", "Nonaktif", "Pensiun"),
      defaultValue: "Aktif",
    },
    catatan_khusus: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_wali_kelas: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Kelas",
        key: "id",
      },
    },
  },
  {
    tableName: "teachers",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Teacher;
