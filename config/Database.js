import pg from 'pg';
import postgres from 'postgres';  
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;

const sql = postgres(connectionString);

const db_app = new Sequelize(connectionString, {
  logging: false,
  protocol: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

export { sql, db_app };