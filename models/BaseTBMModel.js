import { Sequelize } from "sequelize";
import { db_app } from "../config/Database.js";

const DataTypes = Sequelize;

const BaseTBM = db_app.define('base_tbm', {
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
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      tbm: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      tu: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      tk: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      tb: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      tu_tk_tb: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      attp: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      pembibitan: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      planted: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      lain_lain: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      // Add dynamic year columns
      thn2013: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      thn2014: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      thn2015: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      thn2016: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      thn2017: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      thn2018: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      thn2019: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      thn2020: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      thn2021: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      thn2022: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      thn2023: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
}, { freezeTableName: true });

export default BaseTBM;