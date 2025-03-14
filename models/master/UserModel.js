import { Sequelize } from "sequelize";
import {db_immature} from "../config/Database.js";

const DataTypes = Sequelize;

const Users = db_immature.define('users', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    fullname: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    username: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    rpc: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    pks: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    kebun: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    afd: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    account_type: {
        type: DataTypes.TEXT,
        allowNull: true
    },  
    app_type: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    lastLogin: {
        type: DataTypes.DATE,
        allowNull: true
    },
    avatar: {
        type: DataTypes.TEXT,
        defaultValue: 'default.png',
        allowNull: true
    }
}, { freezeTableName: true });

export default Users;