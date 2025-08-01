import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import { db_immature, db_master, db_nursery, db_replanting } from './config/Database.js';
import routerImmature from './routes/immature.js';
import routerMaster from './routes/master.js';
import { rateLimit } from 'express-rate-limit'
import compression from "compression";
import hpp from 'hpp';
import xss from 'xss-clean';
import routerReplanting from './routes/replanting.js';
dotenv.config();

const app = express();

app.use(xss());
app.use(hpp());
app.use(compression());
app.options('*', cors()); 

const corsOptions = {
  origin: [
    "https://ev4palms.vercel.app",
    "http://localhost:3100",
    "https://www.ditn-palmco.my.id",
    "https://picatekpol.my.id",
    "https://ptpn4.co.id",
    "https://www.ptpn4.co.id",
    "https://www.investasi-tanaman.ptpn4.co.id",
    "https://investasi-tanaman.ptpn4.co.id"
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200 // Beberapa browser memerlukan ini
};
app.use(cors(corsOptions));


app.use(bodyParser.json({ limit: '50mb' }));  // Increase the limit as needed
app.use(helmet());  // Security middleware
app.use(morgan('dev'));

const initializeDatabaseMaster = async () => {
    try {
        await db_master.authenticate(); // Test connection
        console.log('Connection master has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

const initializeDatabaseImmature = async () => {
    try {
        await db_immature.authenticate(); // Test connection
        console.log('Connection immature has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

const initializeDatabaseReplanting = async () => {
    try {
        await db_replanting.authenticate(); // Test connection\
        console.log('Connection replanting has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

const initializeDatabaseNursery = async () => {
    try {
        await db_nursery.authenticate(); // Test connection\
        console.log('Connection nursery has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

initializeDatabaseMaster();
initializeDatabaseImmature();
initializeDatabaseReplanting();
initializeDatabaseNursery();



app.use(express.json());  // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies\
app.use(cookieParser());  // Parse Cookie header and populate req.cookies

app.set('trust proxy', 1);


app.use('/api-immature', routerImmature);
app.use('/api-master', routerMaster);
app.use('/api-replanting', routerReplanting);


app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (corsOptions.origin.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 menit
    max: 1000, // Maksimal 100 permintaan per menit per IP
    message: "Terlalu banyak permintaan dari IP ini. Salam dari RZ Security Protocol!",
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
  });
  