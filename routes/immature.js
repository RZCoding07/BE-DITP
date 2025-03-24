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
} from '../controllers/immature/BaseTBM.js';

import {
  getAllVegetatif,
  getVegetatifById,
  createVegetatif,
  updateVegetatif,
  deleteVegetatif,
  getDistinctTahunBulanVegetatif,
  getRulesOfStandarisasiVegetatif,
  getKebunWhereRegVegetatif,
  getAfdWhereKebunVegetatif,
  callProcVegetatif,
  getVegetatifByBulanTahun
} from '../controllers/immature/Vegetatif.js';

import {
  getAllSerapanBiaya,
  getSerapanBiayaById,
  createSerapanBiaya,
  updateSerapanBiaya,
  deleteSerapanBiaya,
  getDistinctTahunBulanSerapanBiaya,
  getSerapanBiayaByBulanTahun
} from '../controllers/immature/SerapanBiaya.js';

import { getAllWhy } from "../controllers/immature/Why.js";

const routerImmature = express.Router();

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

const uploadPi = new Piscina({
  filename: path.resolve(__dirname, '../worker/WorkerPi.js')
});

const uploadSerapanBiaya = new Piscina({
  filename: path.resolve(__dirname, '../worker/WorkerSerapanBiaya.js')
});

// Routes for BaseTBM
routerImmature.get('/base-tbm', getAllBaseTBM);
routerImmature.get('/base-tbm/:id', getBaseTBMById);
routerImmature.post('/base-tbm', createBaseTBM);
routerImmature.put('/base-tbm/:id', updateBaseTBM);
routerImmature.delete('/base-tbm/:id', deleteBaseTBM);

// Routes for SerapanBiaya
routerImmature.get('/serapan-biaya', getAllSerapanBiaya);
routerImmature.get('/serapan-biaya/:id', getSerapanBiayaById);
routerImmature.post('/serapan-biaya', createSerapanBiaya);
routerImmature.put('/serapan-biaya/:id', updateSerapanBiaya);
routerImmature.delete('/serapan-biaya/:id', deleteSerapanBiaya);

routerImmature.post('/serapan-biaya-bulan-tahun', getSerapanBiayaByBulanTahun);

routerImmature.get('/serapan-biaya-distinct-year', getDistinctTahunBulanSerapanBiaya);

routerImmature.get('/why', getAllWhy);

routerImmature.post('/base-tbm/upload', upload.single('file'), async (req, res) => {
  let mappedData = req.body.mappedData || "[]";
  console.log(mappedData.length);
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

routerImmature.post('/pi/upload', upload.single('file'), async (req, res) => {
  let mappedData = req.body.mappedData || "[]";
  try {
    await uploadPi.runTask(mappedData);
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

routerImmature.get('/vegetatif', getAllVegetatif);
routerImmature.get('/vegetatif/:id', getVegetatifById);
routerImmature.post('/vegetatif', createVegetatif);
routerImmature.put('/vegetatif/:id', updateVegetatif);
routerImmature.delete('/vegetatif/:id', deleteVegetatif);
routerImmature.get('/vegetatif-distinct-year', getDistinctTahunBulanVegetatif);
routerImmature.get('/distinct-year-serapan-biaya', getDistinctTahunBulanSerapanBiaya);

routerImmature.get('/vegetatif-bulan-tahun/:bulan/:tahun', getVegetatifByBulanTahun);


routerImmature.get('/interpolate', getRulesOfStandarisasiVegetatif);

routerImmature.post('/vegetatif-proc', callProcVegetatif);

routerImmature.post('/get-kebun-where-reg-vegetatif', getKebunWhereRegVegetatif);
routerImmature.post('/get-afd-where-kebun-vegetatif', getAfdWhereKebunVegetatif);

routerImmature.post('/vegetatif/upload', upload.single('file'), async (req, res) => {
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

routerImmature.post('/serapan-biaya-upload', upload.single('file'), async (req, res) => {
  let mappedData = req.body.mappedData || "[]";
  
  try {
    await uploadSerapanBiaya.runTask(mappedData);
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

export default routerImmature;