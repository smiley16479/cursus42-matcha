import pool from './pool';
import { IDbUser, IUser } from '../types/user';


export async function insertUser(user: IUser) {

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
    connection.release();
}

export async function retrieveUserFromId(id: number): Promise<IDbUser> {
    const connection = await pool.getConnection();

    const sqlQuery = `SELECT * FROM users WHERE id = ?`;
    const [rows] = await connection.query<IDbUser[]>(sqlQuery, [id]);

    connection.release();
    return rows[0];
}