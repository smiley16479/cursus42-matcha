import mysql from 'mysql2';
import dotenvFlow from 'dotenv-flow';

// let connection: mysql.Connection = {} as mysql.Connection;

/* Copy .env variables to process.env */
const envConfig = dotenvFlow.config().parsed;
if (envConfig) {
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();

export default pool;