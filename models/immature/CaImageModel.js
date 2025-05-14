

import { Sequelize, json } from "sequelize";
import { db_immature } from "../../config/Database.js"; 
import PiCa from "./PiCaModel.js"; // Adjust the import path as necessary

const DataTypes = Sequelize;

const CaImage = db_immature.define('ca_images', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    piCaId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: PiCa, key: 'id' }
    },
    caName: { type: DataTypes.STRING, allowNull: false },
    imageData: { type: DataTypes.BLOB('long'), allowNull: false },
    imageType: { type: DataTypes.STRING, allowNull: false },
}, {
    tableName: 'ca_images',
    timestamps: true,
});

PiCa.hasMany(CaImage, { foreignKey: 'piCaId' });
CaImage.belongsTo(PiCa, { foreignKey: 'piCaId' });


export default CaImage;

