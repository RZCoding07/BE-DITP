import { Sequelize, json } from "sequelize";
import { db_immature } from "../../config/Database.js";
import Vegetatif from "./VegetatifModel.js";

const DataTypes = Sequelize;

const PiCa = db_immature.define('pica', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    regional: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    kebun: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    afdeling: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    tahun_tanam: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    vegetatif_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'vegetatif',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    why1: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    why2: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    why3: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    blok: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    value_pi: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    keterangan: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    corrective_actions: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "JSON array of corrective actions with their details",
    },
    created_by: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    updated_by: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    bulan:{
        type: DataTypes.TEXT,
        allowNull: false,
    },
    tahun:{
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, { freezeTableName: true });

Vegetatif.hasMany(PiCa, {
    foreignKey: 'vegetatif_id',
    sourceKey: 'id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

PiCa.belongsTo(Vegetatif, {
    foreignKey: 'vegetatif_id',
    targetKey: 'id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

export default PiCa