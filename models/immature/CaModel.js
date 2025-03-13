import { Sequelize, json } from "sequelize";
import { db_app } from "../../config/Database.js";

const DataTypes = Sequelize;

const Ca = db_app.define('ca', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    w3: {
        type: DataTypes.JSON,
        allowNull: true
    },
    ca: {
        type: DataTypes.JSON,
        allowNull: true
    },
    measurement: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, { freezeTableName: true });

export default Ca