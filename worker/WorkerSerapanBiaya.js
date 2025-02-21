import { parentPort } from 'worker_threads';
import SerapanBiaya from '../models/SerapanBiayaModel.js'; 
import {db_app} from '../config/Database.js'; // Adjust the path to your Sequelize instance

async function handleDataBatch(data) {
  const transaction = await db_app.transaction();
  try {
    await SerapanBiaya.bulkCreate(data, { transaction });
    await transaction.commit();
    return { success: true };
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
