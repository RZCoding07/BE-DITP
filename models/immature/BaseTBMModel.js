import { Sequelize } from "sequelize";
import { db_immature } from "../../config/Database.js";const DataTypes = Sequelize;

const BaseTBM = db_immature.define('base_tbm', {
   id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    regional: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ex_ptpn: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rpc_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      kebun_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nama_kebun: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      komoditi: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tm: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      tbm: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      tu: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      tk: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      tb: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      tu_tk_tb: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      attp: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      pembibitan: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      planted: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      lain_lain: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      total: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      // Add dynamic year columns
      thn2013: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      thn2014: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      thn2015: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      thn2016: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      thn2017: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      thn2018: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      thn2019: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      thn2020: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      thn2021: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      thn2022: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      thn2023: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
}, { freezeTableName: true });

export default BaseTBM;