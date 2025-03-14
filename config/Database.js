// import pg from 'pg';
// import postgres from 'postgres';  
// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';
// dotenv.config();

// const connectionString = process.env.DATABASE_URL;

// const sql = postgres(connectionString);

// const db_immature = new Sequelize(connectionString, {
//   logging: false,
//   protocol: 'postgres',
//   dialectModule: pg,
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false
//     }
//   }
// });

// export { sql, db_immature };

import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

export const db_master = new Sequelize(
  process.env.MASTER_DB_NAME,
  process.env.MASTER_DB_USER,
  process.env.MASTER_DB_PASSWORD,
  {
    host: process.env.MASTER_DB_HOST,
    port: process.env.MASTER_DB_PORT,
    dialect: process.env.MASTER_DB_DIALECT,
    dialectModule: mysql2,
  }
);


export const db_immature = new Sequelize(
  process.env.IMMATURE_DB_NAME,
  process.env.IMMATURE_DB_USER,
  process.env.IMMATURE_DB_PASSWORD,
  {
    host: process.env.IMMATURE_DB_HOST,
    port: process.env.IMMATURE_DB_PORT,
    dialect: process.env.IMMATURE_DB_DIALECT,
    dialectModule: mysql2,
  }
);