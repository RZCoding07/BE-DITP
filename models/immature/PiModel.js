import { Sequelize, json } from "sequelize";
import { db_app } from "../../config/Database.js";

const DataTypes = Sequelize;

const W = db_app.define('pi', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    w1: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    w2: {
        type: DataTypes.JSON,
        allowNull: true
    },
    w3: {
        type: DataTypes.JSON,
        allowNull: true
    },
    measurement: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, { freezeTableName: true });

export default W;