const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../src/config/dbConfig");

const MataPelajaran = sequelize.define(
  "MataPelajaran",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_pelajaran: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    kode_pelajaran: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
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
  },
  {
    tableName: "mata_pelajaran",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = MataPelajaran;
