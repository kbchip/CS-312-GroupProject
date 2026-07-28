import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Search suggestions route
router.get("/search/suggestions", async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.json([]);
        }
        
        const searchTerm = `%${q}%`;
        const result = await pool.query(
            'SELECT id, title, author FROM books WHERE title ILIKE $1 OR author ILIKE $1 LIMIT 5',
            [searchTerm]
        );
        
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

export default router;