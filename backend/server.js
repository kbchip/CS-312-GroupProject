import express from 'express';
import session from 'express-session';
import cors from 'cors'; 
import authRoutes from './routes/auth.js'; 

const app = express();

// 2. Add CORS middleware BEFORE your routes and session
app.use(cors({
    origin: 'http://localhost:5173', // default Vite point, bump to 5174 if it doesn't work.
    credentials: true // Crucial: Allows the session cookie to be sent back and forth
}));

app.use(express.json());

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

// Mock Book Route
app.get("/api/books", (req, res) => {
    res.json([
        { id: 1, title: "The Hobbit", author: "J.R.R. Tolkien" },
        { id: 2, title: "1984", author: "George Orwell" }
    ]);
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}...`);
});