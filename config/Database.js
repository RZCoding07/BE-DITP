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
export const db_app = new Sequelize(
    process.env.APP_DB_NAME,
    process.env.APP_DB_USER,
    process.env.APP_DB_PASSWORD,
    {
      host: process.env.APP_DB_HOST,
      port: process.env.APP_DB_PORT,
      dialect: process.env.APP_DB_DIALECT,
      dialectModule: mysql2,
    }
);
