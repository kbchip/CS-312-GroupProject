import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cors from 'cors'; 
import authRoutes from './routes/auth.js'; 
import pool from './db.js'; 

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // move to 5174 if 5173 doesn't work
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: "my_super_secret_key_for_school_project",
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, 
        maxAge: 1000 * 60 * 60 
    }
}));

// Connect Routes
app.use("/api/auth", authRoutes);

// Database route for books
app.get("/api/books", async (req, res) => {
    try {
        // Query the database table for all books
        const result = await pool.query('SELECT * FROM books');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Database route for reviews on a specific book ID
app.get("/api/reviews/:id", async (req, res) => {
    try {
        // Query DB on given book ID
        const result = await pool.query('SELECT * FROM reviews WHERE book_id = $1', [req.params.id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}...`);
});