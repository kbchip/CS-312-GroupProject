import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cors from 'cors'; 
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js'; 
import pool from './db.js'; 
import bookRoutes from './routes/books.js';

// Recreate __dirname for ES module support
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Dynamic CORS configuration (works locally and in production)
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? true 
        : ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || "my_super_secret_key_for_school_project",
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, 
        maxAge: 1000 * 60 * 60 
    }
}));

// Connect API Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

// Database route for books
app.get("/api/books", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Database route for book lookup by ID
app.get("/api/books/:id", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books WHERE id = $1', [req.params.id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Database route for reviews on a specific book ID
app.get("/api/books/:id/reviews", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT reviews.id, reviews.book_id, reviews.user_id, reviews.rating, reviews.comment, reviews.created_at, users.username
             FROM reviews
             JOIN users ON users.id = reviews.user_id
             WHERE reviews.book_id = $1
             ORDER BY reviews.created_at DESC`,
            [req.params.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.post("/api/books/:id/reviews", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "You must be signed in to post a review." });
        }

        const { rating, comment } = req.body;
        const parsedRating = Number(rating);

        if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
            return res.status(400).json({ error: "Rating must be an integer from 1 to 5." });
        }

        if (!comment || !comment.trim()) {
            return res.status(400).json({ error: "Comment is required." });
        }

        const result = await pool.query(
            `INSERT INTO reviews (book_id, user_id, rating, comment)
             VALUES ($1, $2, $3, $4)
             RETURNING id, book_id, user_id, rating, comment, created_at`,
            [req.params.id, req.session.user.id, parsedRating, comment.trim()]
        );

        res.status(201).json({
            ...result.rows[0],
            username: req.session.user.username,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.patch("/api/books/:bookId/reviews/:reviewId", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "You must be signed in to edit a review." });
        }

        const { rating, comment } = req.body;
        const parsedRating = Number(rating);

        if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
            return res.status(400).json({ error: "Rating must be an integer from 1 to 5." });
        }

        if (!comment || !comment.trim()) {
            return res.status(400).json({ error: "Comment is required." });
        }

        const result = await pool.query(
            `UPDATE reviews
             SET rating = $1, comment = $2
             WHERE id = $3 AND book_id = $4 AND user_id = $5
             RETURNING id, book_id, user_id, rating, comment, created_at`,
            [parsedRating, comment.trim(), req.params.reviewId, req.params.bookId, req.session.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Review not found." });
        }

        res.json({
            ...result.rows[0],
            username: req.session.user.username,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.delete("/api/books/:bookId/reviews/:reviewId", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "You must be signed in to delete a review." });
        }

        const result = await pool.query(
            `DELETE FROM reviews
             WHERE id = $1 AND book_id = $2 AND user_id = $3
             RETURNING id`,
            [req.params.reviewId, req.params.bookId, req.session.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Review not found." });
        }

        res.status(204).send();
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// --- STATIC FILE SERVING FOR PRODUCTION ---
// Points to the frontend build folder relative to backend/server.js
const distPath = path.join(__dirname, '../dist'); // Change to '../frontend/dist' if your build folder is inside a frontend folder

app.use(express.static(distPath));

// Catch-all route to serve index.html for React Router navigation
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

// Use dynamic port provided by environment or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}...`);
});