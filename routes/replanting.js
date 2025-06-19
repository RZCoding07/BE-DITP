import express from "express";
import multer from "multer";
import { Piscina } from 'piscina';
import path from 'path';
import url from 'url';
import { 
  getAllKordinatkebun,
  fetchRegionals,
  fetchKebuns,
  fetchAfdelings,
  fetchMonitoringUnit,
  fetchCorrectiveAction,
  clearCache,
  getCacheStats,
  fetchJobPosition
} from "../controllers/replanting/Maps.js";

const routerReplanting = express.Router();

const storage = multer.memoryStorage();
const __filename = url.fileURLToPath(import.meta.url);

// Kebun coordinate routes
routerReplanting.get('/koordinat-kebun', getAllKordinatkebun);

// Monitoring data routes
routerReplanting.post('/api/d-monev-reg', fetchRegionals);
routerReplanting.post('/api/d-monev-kebun', fetchKebuns);
routerReplanting.post('/api/d-monev-afd', fetchAfdelings);
routerReplanting.post('/api/d-rekap-unit', fetchMonitoringUnit);

routerReplanting.post('/api/d-rekap-ca-unit', fetchCorrectiveAction);
routerReplanting.post('/api/d-rekap-jabatan', fetchJobPosition);
// Cache management routes
routerReplanting.get('/cache/clear', clearCache);
routerReplanting.get('/cache/stats', getCacheStats);

export default routerReplanting;