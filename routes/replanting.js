import express from "express";
import multer from "multer";
import { Piscina } from 'piscina';
import path from 'path';
import url from 'url';

const routerReplanting = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default routerReplanting;