import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: "postgres",
    password: "xr0!2ndb", // Change to your local password
    host: "localhost",
    port: 5432,
    database: "online_bookstore"
});

export default pool;