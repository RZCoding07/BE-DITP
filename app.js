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
import Areal from './models/immature/ASModel.js';
import WeeklyProgress from './models/immature/ProgressMingguanPICAModel.js';
import routerReplanting from './routes/replanting.js';
dotenv.config();

const app = express();
app.use(compression());
// Allow all origins (or specify specific origins if needed)
app.use(cors({
    origin: ["https://ev4palms.vercel.app", "http://localhost:3100", "http://localhost:3000", "https://www.ditn-palmco.my.id", "https://picatekpol.my.id", "https://investasi-tanaman.ptpn4.co.id"], // Frontend origins
    methods: 'GET, POST, PUT, DELETE, OPTIONS', // Allowed methods
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With', // Allowed headers
    credentials: true, // If you need cookies to be included in requests
}));

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
        await db_immature.authenticate(); // Test connection\
        // await WeeklyProgress.sync(); // Sync the model with the database
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


app.use((err, req, res, next) => {
    console.error('Error occurred:', err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error'
        }
    });
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
  