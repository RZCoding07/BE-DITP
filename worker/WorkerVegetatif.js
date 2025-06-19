import { parentPort } from 'worker_threads';
import Vegetatif from '../models/immature/VegetatifModel.js';
import { db_immature } from '../config/Database.js';
import { QueryTypes } from 'sequelize';

// Helper function to validate and format dates
function validateDate(dateString) {
  if (!dateString || dateString === 'Invalid date') {
    return null; // Return null for invalid dates
  }
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    return null;
  }
}

async function handleDataBatch(data) {
  if (!data || data.length === 0) {
    return { success: true, updatedCount: 0, message: 'No data to process' };
  }

  const transaction = await db_immature.transaction();
  try {
    console.log(`Processing batch of ${data.length} records`);
    
    // First, validate all records and fix dates
    const validatedData = data.map(record => ({
      ...record,
      tanggal_pengamatan: validateDate(record.tanggal_pengamatan)
    }));

    const recordsToInsert = [];
    const recordsToUpdate = [];

    // Process records in smaller chunks if needed
    const chunkSize = 100;
    for (let i = 0; i < validatedData.length; i += chunkSize) {
      const chunk = validatedData.slice(i, i + chunkSize);
      
      for (const record of chunk) {
        try {
          const existingRecord = await Vegetatif.findOne({
            where: {
              bulan: record.bulan,
              tahun: record.tahun,
              regional: record.regional,
              kebun: record.kebun,
              afdeling: record.afdeling,
              blok: record.blok
            },
            transaction,
            raw: true
          });

          if (existingRecord) {
            recordsToUpdate.push({
              ...record,
              id: existingRecord.id
            });
          } else {
            recordsToInsert.push(record);
          }
        } catch (error) {
          console.error('Error checking record:', error);
          throw error;
        }
      }
    }

    let insertCount = 0;
    let updateCount = 0;

    // Insert new records
    if (recordsToInsert.length > 0) {
      console.log(`Inserting ${recordsToInsert.length} new records`);
      try {
        await Vegetatif.bulkCreate(recordsToInsert, { transaction });
        insertCount = recordsToInsert.length;
        console.log(`Successfully inserted ${insertCount} records`);
      } catch (insertError) {
        console.error('Bulk insert failed:', insertError);
        throw insertError;
      }
    }

    // Update existing records
    if (recordsToUpdate.length > 0) {
      console.log(`Updating ${recordsToUpdate.length} existing records`);
      try {
        const updateFields = Object.keys(recordsToUpdate[0] || {})
          .filter(field => !['id', 'bulan', 'tahun', 'regional', 'kebun', 'afdeling', 'blok'].includes(field));

        await Vegetatif.bulkCreate(recordsToUpdate, {
          transaction,
          updateOnDuplicate: updateFields
        });
        updateCount = recordsToUpdate.length;
        console.log(`Successfully updated ${updateCount} records`);
      } catch (updateError) {
        console.error('Bulk update failed:', updateError);
        throw updateError;
      }
    }

    await transaction.commit();
    console.log('Transaction committed successfully');
    
    return { 
      success: true, 
      insertCount, 
      updateCount,
      totalProcessed: data.length
    };
  } catch (error) {
    console.error('Transaction failed:', error);
    await transaction.rollback();
    return { 
      success: false, 
      error: error.message,
      stack: error.stack 
    };
  }
}

parentPort.on('message', async (data) => {
  try {
    console.log('Worker received data batch');
    const result = await handleDataBatch(data);
    parentPort.postMessage(result);
  } catch (error) {
    console.error('Worker error:', error);
    parentPort.postMessage({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

export default handleDataBatch;