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
  clearCache,
  getCacheStats,
  fetchJobPosition,
  fetchMonitoringRegional,
  fetchMonitoringAfdeling,
  fetchCorrectiveActionRegional,
  fetchCorrectiveActionKebun,
  fetchCorrectiveActionAfdeling,
  fetchDetail,
  fetchDeleteMonevDetail,
  fetchDetailMonevDetail,
  fetchDetailBelumMonev,
  fetchRekapKaryawanBelumMonev,
  fetchMonev,
  fetchMonitoringPalmco
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


routerReplanting.post('/api/d-monev-detail', fetchDetail);

routerReplanting.post('/api/d-rekap-palmco', fetchMonitoringPalmco);
routerReplanting.post('/api/d-rekap-regional', fetchMonitoringRegional);
routerReplanting.post('/api/d-rekap-unit', fetchMonitoringUnit);
routerReplanting.post('/api/d-rekap-afd', fetchMonitoringAfdeling);

// Corrective action routes

routerReplanting.post('/api/d-rekap-ca-regional', fetchCorrectiveActionRegional);
routerReplanting.post('/api/d-rekap-ca-unit', fetchCorrectiveActionKebun);
routerReplanting.post('/api/d-rekap-ca-afd', fetchCorrectiveActionAfdeling);
routerReplanting.post('/api/d-monev-delete-detail', fetchDeleteMonevDetail);

routerReplanting.post('/api/d-rekap-karyawan-belum-monev', fetchRekapKaryawanBelumMonev);
routerReplanting.post('/api/d-rekap-blok-tu-dev', fetchMonev);


routerReplanting.get('/api/monitoring-evaluasi/:id', fetchDetailMonevDetail);

routerReplanting.post('/api/d-rekap-jabatan', fetchJobPosition);
// Cache management routes
routerReplanting.get('/cache/clear', clearCache);
routerReplanting.get('/cache/stats', getCacheStats);

export default routerReplanting;