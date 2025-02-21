import { Sequelize } from "sequelize";
import { db_app } from "../config/Database.js";

const DataTypes = Sequelize;

const SerapanBiaya = db_app.define('serapan_biaya', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    regional: {
        type: DataTypes.STRING,
        allowNull: false
    },
    kebun: {
        type: DataTypes.STRING,
        allowNull: false
    },
    luas: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    real_sd: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    rkap_sd: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    persen_serapan: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    rp_ha: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    bulan: {
        type: DataTypes.INTEGER,
        allowNull: false
    }, 
    tahun: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true
});

export default SerapanBiaya;
