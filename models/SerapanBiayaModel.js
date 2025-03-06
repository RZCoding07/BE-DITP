import { Sequelize } from "sequelize";
import { db_app } from "../config/Database.js";

const DataTypes = Sequelize;

const SerapanBiaya = db_app.define('serapan_biaya', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: true },
    regional: {
        type: DataTypes.STRING,
        allowNull: true
    },
    kebun: {
        type: DataTypes.STRING,
        allowNull: true
    },
    luas: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    real_sd: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    rkap_sd: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    persen_serapan: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    rp_ha: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    bulan: {
        type: DataTypes.INTEGER,
        allowNull: true
    }, 
    tahun: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    tbm: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: true
});

export default SerapanBiaya;
