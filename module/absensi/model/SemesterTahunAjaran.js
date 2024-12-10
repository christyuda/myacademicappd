const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../src/config/dbConfig");

const SemesterTahunAjaran = sequelize.define(
  "SemesterTahunAjaran",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tahun_ajaran: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    semester: {
      type: DataTypes.ENUM("Ganjil", "Genap"),
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
    tableName: "semester_tahun_ajaran",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = SemesterTahunAjaran;
