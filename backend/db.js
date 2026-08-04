import pg from 'pg';
const { Pool } = pg;

// Check if a DATABASE_URL environment variable exists (used by Render in production)
const connectionString = process.env.DATABASE_URL;

const pool = new Pool(
    connectionString
        ? {
              connectionString: connectionString,
              ssl: {
                  rejectUnauthorized: false // Required for Render remote PostgreSQL
              }
          }
        : {
              user: process.env.DB_USER || 'postgres',
              password: String(process.env.DB_PASSWORD),
              host: process.env.DB_HOST || 'localhost',
              port: Number(process.env.DB_PORT || 5432),
              database: "online_bookstore"
          }
);

export default pool;