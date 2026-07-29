import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cors from 'cors'; 
import authRoutes from './routes/auth.js'; 
import pool from './db.js'; 
import bookRoutes from './routes/books.js';

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
app.use("/api/books", bookRoutes);

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

// Database route for book lookup by ID
app.get("/api/books/:id", async (req, res) => {
    try {
        // Query DB on given book ID
        const result = await pool.query('SELECT * FROM books WHERE id = $1', [req.params.id]);
        res.json(result.rows[0]); // return only first result (there should only be one anyway)
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

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}...`);
});