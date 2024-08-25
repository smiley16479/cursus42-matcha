import mysql from 'mysql2';
import dotenvFlow from 'dotenv-flow';

/* Copy .env variables to process.env */
const envConfig = dotenvFlow.config().parsed;
if (envConfig) {
    Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
    });
}

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

connection.connect(error => {
    if (error)
        throw error;
    console.log('Connected to the database.');
})

export default connection;