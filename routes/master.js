import express from "express";
import multer from "multer";
import { Piscina } from 'piscina';
import path from 'path';
import url from 'url';
import bcrypt from 'bcrypt';
import {
  getAllUsers,
  getAllUsersByAccountType,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getMe
} from "../controllers/master/Users.js";

const routerMaster = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadUsers = new Piscina({
  filename: path.resolve(__dirname, '../worker/WorkerUser.js')
});


routerMaster.post('/me', getMe);
routerMaster.post('/login', loginUser);
routerMaster.get('/users', getAllUsers);
routerMaster.post('/users', createUser);
routerMaster.get('/users/account/:account_type', getAllUsersByAccountType);
routerMaster.get('/users/:id', getUserById);
routerMaster.put('/users/update/:id', updateUser);
routerMaster.get('/users/:id', getUserById);
routerMaster.delete('/users/:id', upload.none(), deleteUser);


routerMaster.post('/users/upload', upload.none(), async (req, res) => {
  let mappedData = req.body.mappedData || "[]";

  if (Array.isArray(mappedData)) {
    for (let user of mappedData) {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }

  try {
    await uploadUsers.runTask(mappedData);
    res.status(200).json({
      status_code: 200,
      message: 'Upload Data Selesai!',
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status_code: 500,
      message: `Oops terjadi kesalahan, periksa koneksi dan coba lagi! ${error}`,
    });
  }
});


export default routerMaster;