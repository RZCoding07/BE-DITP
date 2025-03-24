import { parentPort } from 'worker_threads';
import User from '../models/master/UserModel.js';
import {db_master} from '../config/Database.js'; // Adjust the path to your Sequelize instance

async function handleDataBatch(data) {
  const transaction = await db_master.transaction();
  try {
    await User.bulkCreate(data, { transaction });
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
