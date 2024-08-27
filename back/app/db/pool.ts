import mysql from 'mysql2/promise';
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
});

export default pool;

// export async function connect() {
//     connection = await mysql.createConnection({
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME
//     });
// }

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// }).then(=> {
//     connection.connect(error => {
//         if (error)
//             throw error;
//         console.log('Connected to the database.');
//     })
// });

// export default connection;