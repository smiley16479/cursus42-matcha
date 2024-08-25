import connection from './connect';

export default function initDb() {
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

    connection.query(sqlQuery, (err: Error, results: Request, fields: any) => {
        if (err) {
            console.log('An error occurred while creating the table');
            throw err;
        }
    });
}