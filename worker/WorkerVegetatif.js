import { parentPort } from 'worker_threads';
import Vegetatif from '../models/immature/VegetatifModel.js';
import {db_immature} from '../config/Database.js'; // Adjust the path to your Sequelize instance

async function handleDataBatch(data) {
  const transaction = await db_immature.transaction();
  try {
    await Vegetatif.bulkCreate(data, { transaction });
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
