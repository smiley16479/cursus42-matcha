import pool from './pool';

export default async function initDb() {

    const connection = await pool.getConnection();

    const sqlQuery = `
    CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    gender ENUM('Female', 'Male') NOT NULL,
    sexualPref ENUM('Female', 'Male', 'Both') NOT NULL,
    biography TEXT NOT NULL,
    fameRate INT NOT NULL,
    latitude DECIMAL(15, 10),
    longitude DECIMAL(15, 10),
    lastConnection TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

    const [results, fields] = await connection.query(sqlQuery);
    connection.release();
}