import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../db.js'; 

const router = express.Router();

const buildSessionUser = (userRow) => ({
    id: userRow.id,
    username: userRow.username,
    email: userRow.email,
});

router.get("/me", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    res.json({ user: req.session.user });
});

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Unable to log out" });
        }

        res.clearCookie("connect.sid");
        res.json({ message: "Logout successful" });
    });
});

// Register a new user
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
            [username, email, hashedPassword]
        );

        req.session.user = buildSessionUser(newUser.rows[0]);
        res.json({ message: "Registration successful", user: req.session.user });
    } catch {
        res.status(500).json({ error: "Server error or user already exists." });
    }
});

// Login user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) return res.status(401).json("Invalid Credentials");

        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) return res.status(401).json("Invalid Credentials");

        req.session.user = buildSessionUser(user.rows[0]);
        res.json({ message: "Login successful", user: req.session.user });
    } catch {
        res.status(500).send("Server error");
    }
});

export default router;