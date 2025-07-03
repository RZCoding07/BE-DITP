import { parentPort } from 'worker_threads';
import SerapanBiaya from '../models/immature/SerapanBiayaModel.js'; 
import { db_immature } from '../config/Database.js';

async function handleDataBatch(data) {
  const results = [];
  
  for (const item of data) {
    const transaction = await db_immature.transaction();
    try {
      await SerapanBiaya.create(item, { transaction });
      await transaction.commit();
      results.push({ success: true, data: item });
    } catch (error) {
      await transaction.rollback();
      results.push({ 
        success: false, 
        data: item, 
        error: error.message 
      });
    }
  }
  
  return results;
}

parentPort.on('message', async (data) => {
  const results = await handleDataBatch(data);
  parentPort.postMessage(results);
});

export default handleDataBatch;