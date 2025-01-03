import express from "express";
import multer from "multer";
import { Piscina } from 'piscina';
import path from 'path';
import url from 'url';
import {
  getAllBaseTBM,
  getBaseTBMById,
  createBaseTBM,
  updateBaseTBM,
  deleteBaseTBM
} from '../controllers/BaseTBM.js';

import {
  getAllVegetatif,
  getVegetatifById,
  createVegetatif,
  updateVegetatif,
  deleteVegetatif,
  getDistinctTahunBulanVegetatif
} from '../controllers/Vegetatif.js';

const $routes = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadBaseTBM = new Piscina({
  filename: path.resolve(__dirname, '../worker/WorkerBaseTBM.js')
});

const uploadVegetatif = new Piscina({
  filename: path.resolve(__dirname, '../worker/WorkerVegetatif.js')
});

// Routes for BaseTBM
$routes.get('/base-tbm', getAllBaseTBM);
$routes.get('/base-tbm/:id', getBaseTBMById);
$routes.post('/base-tbm', createBaseTBM);
$routes.put('/base-tbm/:id', updateBaseTBM);
$routes.delete('/base-tbm/:id', deleteBaseTBM);


$routes.post('/base-tbm/upload', upload.single('file'), async (req, res) => {
  let mappedData = req.body.mappedData || "[]";
  
  try {
    await uploadBaseTBM.runTask(mappedData);
    res.status(200).json({
      status_code: 200,
      message: 'Upload Data Selesai!',
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status_code: 500,
      message: 'Upload Data Gagal!',
    });
  }
});


$routes.get('/vegetatif', getAllVegetatif);
$routes.get('/vegetatif/:id', getVegetatifById);
$routes.post('/vegetatif', createVegetatif);
$routes.put('/vegetatif/:id', updateVegetatif);
$routes.delete('/vegetatif/:id', deleteVegetatif);
$routes.get('/vegetatif-distinct-tahun', getDistinctTahunBulanVegetatif);

$routes.post('/vegetatif/upload', upload.single('file'), async (req, res) => {
  let mappedData = req.body.mappedData || "[]";
  
  try {
    await uploadVegetatif.runTask(mappedData);
    res.status(200).json({
      status_code: 200,
      message: 'Upload Data Selesai!',
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status_code: 500,
      message: 'Upload Data Gagal!',
    });
  }
});

export default $routes;