import { Sequelize } from "sequelize";
import { db_immature } from "../config/Database.js";

const DataTypes = Sequelize;

const LogActivity = db_immature.define('log_Activity', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    table_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    record_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    data_before: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    data_after: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    app_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id : {
        type: DataTypes.UUID,
        allowNull: false
    }
}, { freezeTableName: true });

export default LogActivity;