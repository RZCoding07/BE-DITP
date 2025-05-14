import { Sequelize } from "sequelize";
import { db_immature } from "../../config/Database.js";

const DataTypes = Sequelize;

const Areal = db_immature.define('areal', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nama_kebun_sap: {
        type: DataTypes.STRING,
        allowNull: false
    },
    kode_kebun: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tahun_tbm: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    luasan: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    bulan: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tahun: {
        type: DataTypes.INTEGER,  // You can name this differently if needed
        allowNull: false
    }
}, { 
    freezeTableName: true 
});

export default Areal;
