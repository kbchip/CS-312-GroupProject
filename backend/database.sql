-- Create the database
CREATE DATABASE online_bookstore;

-- (Make sure you connect to the online_bookstore database before running the next command!)

-- Create the books table (for your current book list functionality)
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT
);

-- Create the users table for Student 2 Authentication tasks
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

-- Create the reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(id),
    user_id INTEGER REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Insert dummy data so you have something to work with
INSERT INTO books (title, author, description) 
VALUES ('The Hobbit', 'J.R.R. Tolkien', 'A fantasy novel.');