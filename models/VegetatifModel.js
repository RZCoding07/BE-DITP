import { Sequelize } from "sequelize";
import { db_app } from "../config/Database.js"; const DataTypes = Sequelize;


const Vegetatif = db_app.define('vegetatif', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },

  rpc: {
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
  },
  jpa: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  jpk: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  blok: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  luas: {
    type: DataTypes.TEXT,
    allowNull: false,
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
  tahun: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  bulan: {
    type: DataTypes.TEXT,
    allowNull: false
  }

}, { freezeTableName: true });

export default Vegetatif;