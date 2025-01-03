import { Sequelize } from "sequelize";
import { db_app } from "../config/Database.js";const DataTypes = Sequelize;


const Vegetatif = db_app.define('vegetatif', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },

  entitas: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  kebun: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  afd: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  tahunTanam: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'tahun_tanam'
  },
  blok: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  luas: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Area in Hectares'
  },
  sph: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  varietas: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  lingkarBatang: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tinggiBatang: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  jumlahPelepah: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  panjangRachis: { 
    type: DataTypes.TEXT,
    allowNull: true,
  },
  lebarPetiolaL: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  lebarPetiolaT: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  jad: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Adding measurement points 1-6
  measurement1L: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  measurement1P: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  measurement2L: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  measurement2P: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  measurement3L: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  measurement3P: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  measurement4L: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  measurement4P: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  measurement5L: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  measurement5P: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  measurement6L: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  measurement6P: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rerataL: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Average value L'
  },
  rerataP: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Average value P'
  },
  tahun : {
    type: DataTypes.TEXT,
    allowNull: false
  },
  bulan : {
    type: DataTypes.TEXT,
    allowNull: false
  }
  
}, { freezeTableName: true });

export default Vegetatif;