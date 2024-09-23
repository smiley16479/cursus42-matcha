import mysql from 'mysql2';
import dotenvFlow from 'dotenv-flow';

/* Copy .env variables to process.env */
const envConfig = dotenvFlow.config().parsed;
if (envConfig) {
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}

await new Promise(resolve => setTimeout(resolve, 5000));

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();

export default pool;
export { default as sql } from 'sql-template-tag';