import pool from './pool';
import { Gender, SexualPref, User } from '../types/user';


export async function insertUser(user: User) {

    const connection = await pool.getConnection();

    const sqlQuery = `INSERT INTO users (
    email,
    firstName,
    lastName,
    password,
    gender,
    sexualPref,
    biography,
    fameRate,
    latitude,
    longitude,
    lastConnection)
    VALUES (
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?
    )`;

    const userAttrs = [
        user.email,
        user.firstName,
        user.lastName,
        user.password,
        user.gender,
        user.sexualPref,
        user.biography,
        user.fameRate,
        user.longitude,
        user.latitude,
        new Date(user.lastConnection)
    ];

    const [results, fields] = await connection.query(sqlQuery, userAttrs);
}

export async function retrieveUserFromId(id: number) {
    const connection = await pool.getConnection();

    const sqlQuery = `SELECT * FROM users WHERE id = ?`;

    const [results, fields] = await connection.query(sqlQuery, [id]);

    console.log(results);
    return results;
}