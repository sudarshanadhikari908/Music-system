import mysql, { Pool } from "mysql2/promise";
import config from "./config/config";

// Create a MySQL connection pool
const pool: Pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// SQL queries to create tables
const createUserTableQuery = `
  CREATE TABLE IF NOT EXISTS User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20),
    dob DATETIME,
    gender ENUM('M', 'F', 'O'),
    address VARCHAR(255),
    email VARCHAR(100) UNIQUE NOT NULL,
    refresh_token VARCHAR(500),
    role ENUM('super_admin', 'artist_manager', 'artist') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
`;

const createArtistTableQuery = `
  CREATE TABLE IF NOT EXISTS Artist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dob DATETIME,
    gender ENUM('M', 'F', 'O'),
    address VARCHAR(255),
    no_of_albums_released INT,
    bio TEXT,
    first_release_year YEAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
`;

const createSongTableQuery = `
  CREATE TABLE IF NOT EXISTS Song (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    artist_id INT NOT NULL,
    album_name VARCHAR(255),
    genre ENUM('rnb', 'country', 'classic', 'rock', 'jazz'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_artist FOREIGN KEY (artist_id) REFERENCES Artist(id) ON DELETE CASCADE 
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
