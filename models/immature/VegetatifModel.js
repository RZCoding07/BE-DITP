import { Sequelize } from "sequelize";
import { db_app } from "../../config/Database.js"; const DataTypes = Sequelize;


const Vegetatif = db_app.define('vegetatif', {
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
  blok: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tahun_tanam: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  varietas: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  luas_ha: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  jumlah_pokok_awal_tanam: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  jumlah_pokok_sekarang: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tinggi_tanaman_cm: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  jumlah_pelepah_bh: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  panjang_rachis_cm: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  lebar_petiola_cm: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tebal_petiola_cm: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  jad_1_sisi: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rerata_panjang_anak_daun: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rerata_lebar_anak_daun: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  lingkar_batang_cm: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tahun: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  bulan: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  bulan_tanam: {
    type: DataTypes.TEXT,
    defaultValue: '12',
    allowNull: false
  },

}, { freezeTableName: true });

export default Vegetatif;