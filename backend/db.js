import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: String(process.env.DB_PASSWORD),
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    database: "online_bookstore"
});

export default pool;