import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function createDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres',
  });

  try {
    await client.connect();
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [process.env.DB_NAME || 'user_doctor']
    );

    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE ${process.env.DB_NAME || 'user_doctor'}`);
      console.log(`Database "${process.env.DB_NAME || 'user_doctor'}" created successfully!`);
    } else {
      console.log(`Database "${process.env.DB_NAME || 'user_doctor'}" already exists.`);
    }
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

createDatabase();