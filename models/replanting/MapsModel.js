import { Sequelize } from "sequelize";
import {db_replanting} from "../../config/Database.js";

const DataTypes = Sequelize;

const Ckebun = db_replanting.define('c_kebun', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      Kodering: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
      },
      Kebun: {
        type: DataTypes.STRING(512),
        allowNull: true,
        defaultValue: null,
      },
      Latitude: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
      },
      Longitude: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
      },
    }, {
      tableName: 'c_kebun',
      timestamps: false, // Jika tidak ada kolom createdAt dan updatedAt
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });

export default Ckebun;