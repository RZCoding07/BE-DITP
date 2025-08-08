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
  getVegetatifByBulanTahun,
  getVwVegetatifById,
  getDistinctBulanVegetatif,
  bulkDeleteVegetatif,
  getAllVegetatifProgress,
  getRulesOfStandarisasiVegetatifDataset
} from '../controllers/immature/Vegetatif.js';

import {
  getAllSerapanBiaya,
  getSerapanBiayaById,
  createSerapanBiaya,
  updateSerapanBiaya,
  deleteSerapanBiaya,
  getDistinctTahunBulanSerapanBiaya,
  getSerapanBiayaByBulanTahun,
  getSerapanBiayaByBulanTahunRegional
} from '../controllers/immature/SerapanBiaya.js';

import { createPi, deletePiById, getAllWhy, getPiById, updatePiById } from "../controllers/immature/Why.js";
import { createCa, getAllCa } from "../controllers/immature/CorrectiveAction.js";
import { deletePiCa, getAllPiCaCursor, getAllPiCaWithoutCorrectiveActions, getCaGraph, getDetailPicaWhereVegetatifId, getVwFinalPica, picaw3Count, submitPiCa } from "../controllers/immature/PICA.js";
import { getAllAreal, getAllArealTbm, getAllArealTbmMaster, getAllKebunVegetatifAreal, getAllKebunVegetatifArealTbm, vwCalculateAreal } from "../controllers/immature/ArealStatement.js";
import { getProgress, saveProgress } from "../controllers/immature/ProgressMingguanPICA.js";

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

const uploadAS = new Piscina({
  filename: path.resolve(__dirname, '../worker/WorkerAs.js')
});

const uploadPi = new Piscina({
  filename: path.resolve(__dirname, '../worker/WorkerPi.js')
});

const uploadCa = new Piscina({
  filename: path.resolve(__dirname, '../worker/WorkerCa.js')
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

//routes for PiCa Weekly Progress
routerImmature.post('/weekly-progress/save', saveProgress);
routerImmature.get('/weekly-progress/:id', getProgress);

// Routes for SerapanBiaya
routerImmature.get('/serapan-biaya', getAllSerapanBiaya);
routerImmature.get('/serapan-biaya/:id', getSerapanBiayaById);
routerImmature.post('/serapan-biaya', createSerapanBiaya);
routerImmature.put('/serapan-biaya/:id', updateSerapanBiaya);
routerImmature.delete('/serapan-biaya/:id', deleteSerapanBiaya);

routerImmature.post('/serapan-biaya-bulan-tahun', getSerapanBiayaByBulanTahun);
routerImmature.post('/serapan-biaya-bulan-tahun-regional', getSerapanBiayaByBulanTahunRegional);

routerImmature.get('/serapan-biaya-distinct-year', getDistinctTahunBulanSerapanBiaya);

routerImmature.get('/why', getAllWhy);
routerImmature.post('/why', createPi);
routerImmature.delete('/why/:id', deletePiById);
routerImmature.get('/why/:id', getPiById);
routerImmature.put('/why/:id', updatePiById);

routerImmature.get('/ca', getAllCa);
routerImmature.post('/ca', createCa);

routerImmature.post('/areal-tbm-rpc-kebun', getAllArealTbm);
routerImmature.post('/areal-tbm-master', getAllArealTbmMaster);

routerImmature.post('/get-rpc-kebun-veg-areal', getAllKebunVegetatifAreal);
routerImmature.post('/get-rpc-kebun-veg-areal-tbm', getAllKebunVegetatifArealTbm);
routerImmature.get('/get-pica-w3-count', picaw3Count);
routerImmature.get('/get-vegetatif-progress/:tahun', getAllVegetatifProgress);

routerImmature.post('/vw-areal-calculate', vwCalculateAreal);

routerImmature.post('/areal/upload', upload.single('file'), async (req, res) => {
  let mappedData = req.body.mappedData || "[]";
  try {
    await uploadAS.runTask(mappedData);
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

routerImmature.post('/ca/upload', upload.single('file'), async (req, res) => {
  let mappedData = req.body.mappedData || "[]";
  try {
    await uploadCa.runTask(mappedData);
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

routerImmature.get('/luas-areal-statement', getAllAreal);

routerImmature.post('/vegetatif', getAllVegetatif);
routerImmature.post('/get-vw-vegetatif', getVwVegetatifById);
routerImmature.get('/vegetatif/:id', getVegetatifById);
routerImmature.post('/vegetatif', createVegetatif);
routerImmature.put('/vegetatif/:id', updateVegetatif);
routerImmature.delete('/vegetatif/:id', deleteVegetatif);
routerImmature.post('/vegetatif/bulk', bulkDeleteVegetatif);
routerImmature.get('/vegetatif-distinct-year', getDistinctTahunBulanVegetatif);
routerImmature.post('/vegetatif-distinct-month', getDistinctBulanVegetatif);

routerImmature.get('/distinct-year-serapan-biaya', getDistinctTahunBulanSerapanBiaya);
routerImmature.get('/vegetatif-bulan-tahun/:bulan/:tahun', getVegetatifByBulanTahun);

routerImmature.get('/interpolate', getRulesOfStandarisasiVegetatif);
routerImmature.get('/interpolate-dataset', getRulesOfStandarisasiVegetatifDataset);

routerImmature.get('/pica-all', getAllPiCaCursor);
routerImmature.get('/pica-no-ca', getAllPiCaWithoutCorrectiveActions);

routerImmature.post('/delete-pica', deletePiCa);
routerImmature.post('/get-final-detail-pica', getDetailPicaWhereVegetatifId);

routerImmature.get('/', getRulesOfStandarisasiVegetatif);

routerImmature.post('/vegetatif-proc', callProcVegetatif);
routerImmature.post('/vegetatif-final',  getVwFinalPica);

routerImmature.post('/graph-ca', getCaGraph);

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


routerImmature.post('/submit-pi-ca', upload.any(), submitPiCa);

export default routerImmature;