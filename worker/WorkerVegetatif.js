import { parentPort } from 'worker_threads';
import Vegetatif from '../models/immature/VegetatifModel.js';
import { db_immature } from '../config/Database.js';
import { QueryTypes } from 'sequelize';

async function handleDataBatch(data) {
  const transaction = await db_immature.transaction();
  try {
    if (!data || data.length === 0) {
      return { success: true, updatedCount: 0, message: 'No data to process' };
    }

    // Prepare arrays for bulk insert and update
    const recordsToInsert = [];
    const recordsToUpdate = [];

    // Check each record individually
    for (const record of data) {
      const existingRecord = await db_immature.query(
        `SELECT id FROM vegetatif 
         WHERE bulan = :bulan 
           AND tahun = :tahun 
           AND regional = :regional 
           AND kebun = :kebun 
           AND afdeling = :afdeling 
           AND blok = :blok`,
        {
          replacements: {
            bulan: record.bulan,
            tahun: record.tahun,
            regional: record.regional,
            kebun: record.kebun,
            afdeling: record.afdeling,
            blok: record.blok
          },
          type: QueryTypes.SELECT,
          transaction
        }
      );

      if (existingRecord.length > 0) {
        // Record exists, prepare for update
        recordsToUpdate.push({
          ...record,
          id: existingRecord[0].id // Include the existing ID for update
        });
      } else {
        // New record, prepare for insert
        recordsToInsert.push(record);
      }
    }

    let insertCount = 0;
    let updateCount = 0;

    // Perform bulk insert for new records
    if (recordsToInsert.length > 0) {
      await Vegetatif.bulkCreate(recordsToInsert, { transaction });
      insertCount = recordsToInsert.length;
    }

    // Perform updates for existing records
    if (recordsToUpdate.length > 0) {
      // Determine which fields to update (all except the unique key fields)
      const firstItem = recordsToUpdate[0] || {};
      const allFields = Object.keys(firstItem);
      const uniqueKeyFields = ['id', 'bulan', 'tahun', 'regional', 'kebun', 'afdeling', 'blok'];
      const fieldsToUpdate = allFields.filter(field => !uniqueKeyFields.includes(field));

      await Vegetatif.bulkCreate(recordsToUpdate, {
        transaction,
        updateOnDuplicate: fieldsToUpdate
      });
      updateCount = recordsToUpdate.length;
    }

    await transaction.commit();
    return { 
      success: true, 
      insertCount, 
      updateCount,
      totalProcessed: data.length
    };
  } catch (error) {
    await transaction.rollback();
    return { 
      success: false, 
      error: error.message,
      stack: error.stack 
    };
  }
}

parentPort.on('message', async (data) => {
  const result = await handleDataBatch(data);
  parentPort.postMessage(result);
});

export default handleDataBatch;