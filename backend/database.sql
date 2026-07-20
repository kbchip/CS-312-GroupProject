-- Create the database
CREATE DATABASE online_bookstore;

    -- (Make sure you connect to the online_bookstore database before running the next command!)

    -- Create the users table for Student 2 Authentication tasks
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL
    );