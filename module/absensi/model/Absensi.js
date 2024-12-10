const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../src/config/dbConfig");

const Attadance = sequelize.define(
  "Attadance",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
    kelas_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Kelas",
        key: "id",
      },
    },
    mata_pelajaran_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "MataPelajaran",
        key: "id",
      },
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    keterangan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "attadances",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
