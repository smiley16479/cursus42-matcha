// init-db.js, non encore connecté: sera utilisé pour setUp la db si elle n'y a pas de backUP ds mysql-data
const connection = require('./db');

const createTables = () => {
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  connection.query(usersTable, (err, results, fields) => {
    if (err) {
      console.log('An error occurred while creating the table');
      throw err;
    }
    console.log('Users table created successfully');
  });

  // Add more table creation queries here if needed
};

createTables();