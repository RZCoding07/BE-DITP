import { parentPort } from 'worker_threads';
import Areal from '../models/immature/ASModel.js';
import { db_immature } from '../config/Database.js';
import { Op } from 'sequelize';

async function handleDataBatch(data) {
  const transaction = await db_immature.transaction();
  try {
    // First check for existing records
    const existingRecords = await Areal.findAll({
      where: {
        [Op.or]: data.map(item => ({
          kode_kebun: item.kode_kebun,
          bulan: item.bulan,
          tahun: item.tahun,
          tahun_tbm: item.tahun_tbm
        }))
      },
      transaction
    });

    // Filter out duplicates
    const newData = data.filter(item => 
      !existingRecords.some(existing => 
        existing.kode_kebun === item.kode_kebun &&
        existing.bulan === item.bulan &&
        existing.tahun === item.tahun &&
        existing.tahun_tbm === item.tahun_tbm
      )
    );

    // Update existing records
    const updatePromises = existingRecords.map(existing => {
      const matchingItem = data.find(item => 
        item.kode_kebun === existing.kode_kebun &&
        item.bulan === existing.bulan &&
        item.tahun === existing.tahun &&
        item.tahun_tbm === existing.tahun_tbm
      );
      
      if (matchingItem) {
        return existing.update({
          luasan: matchingItem.luasan,
          nama_kebun_sap: matchingItem.nama_kebun_sap
        }, { transaction });
      }
      return Promise.resolve();
    });

    await Promise.all(updatePromises);
    
    // Insert new records
    if (newData.length > 0) {
      await Areal.bulkCreate(newData, { transaction });
    }

    await transaction.commit();
    return { 
      success: true, 
      stats: {
        inserted: newData.length,
        updated: existingRecords.length,
        duplicates: data.length - (newData.length + existingRecords.length)
      }
    };
  } catch (error) {
    await transaction.rollback();
    return { success: false, error: error.message };
  }
}

parentPort.on('message', async (data) => {
  const result = await handleDataBatch(data);
  parentPort.postMessage(result);
});

export default handleDataBatch;