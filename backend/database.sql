-- Create the database
CREATE DATABASE online_bookstore;

-- (Make sure you connect to the online_bookstore database before running the next command!)

-- Create the books table (for your current book list functionality)
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    published_year INTEGER
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

-- Insert sample books including descriptions and published years
INSERT INTO books (title, author, description, published_year) 
VALUES 
('The Hobbit', 'J.R.R. Tolkien', 'A fantasy novel.', 1937),
('To Kill a Mockingbird', 'Harper Lee', 'A classic novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.', 1960),
('1984', 'George Orwell', 'A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.', 1949),
('The Great Gatsby', 'F. Scott Fitzgerald', 'A portrait of the Jazz Age in all of its decadence and excess.', 1925),
('Pride and Prejudice', 'Jane Austen', 'A romantic novel of manners following character development of Elizabeth Bennet.', 1813);

-- Insert a mock user for initial reviews
INSERT INTO users (id, username, email, password_hash) 
VALUES (1, 'testuser', 'test@example.com', 'dummy_hash')
ON CONFLICT (id) DO NOTHING;

-- Insert placeholder reviews tied to the user and books
INSERT INTO reviews (book_id, user_id, rating, comment) 
VALUES 
(1, 1, 5, 'An absolute classic fantasy masterpiece! Tolkien world-building is unmatched.'),
(1, 1, 4, 'A wonderful adventure, though it starts off a bit slow.'),
(2, 1, 5, 'Powerful and deeply moving. Every student should read this book.'),
(3, 1, 4, 'Frighteningly relevant and prophetic. A must-read dystopian novel.'),
(4, 1, 5, 'The prose is gorgeous and captures the tragedy of the era perfectly.'),
(5, 1, 5, 'Witty, charming, and timeless romance.');