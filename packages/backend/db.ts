import mysql, { Pool } from 'mysql2/promise';
import config from './config/config'; 

// Create a MySQL connection pool
const pool: Pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// SQL queries to create tables
const createUserTableQuery = `
  CREATE TABLE IF NOT EXISTS User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('super_admin', 'artist_manager', 'artist') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const createArtistTableQuery = `
  CREATE TABLE IF NOT EXISTS Artist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    genre VARCHAR(50),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const createSongTableQuery = `
  CREATE TABLE IF NOT EXISTS Song (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    artist_id INT,
    album VARCHAR(100),
    release_date DATE,
    genre VARCHAR(50),
    duration INT, -- In seconds
    FOREIGN KEY (artist_id) REFERENCES Artist(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

// Function to create tables
async function createTables(): Promise<void> {
  try {
    await pool.query(createUserTableQuery);
    await pool.query(createArtistTableQuery);
    await pool.query(createSongTableQuery);
    console.log("Tables created successfully");
  } catch (err) {
    console.error("Error creating tables: ", err);
  }
}

// Create tables on startup
createTables();

export default pool;
