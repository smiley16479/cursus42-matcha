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

export async function deleteUser(id: number) {
    const connection = await pool.getConnection();

    const sqlQuery = 'DELETE FROM users WHERE id = ?';
    const [results, fields] = await connection.query(sqlQuery, id);

    connection.release();
}

export async function updateUser(id: number, user: IUser) {
    const connection = await pool.getConnection();

    let sqlQuery = 'UPDATE users SET ';
    let userAttrs: any[] = [];

    Object.keys(user).forEach((key: string, index: number) => {
        if (index != 0) {
            sqlQuery = sqlQuery + ', '
        }
        sqlQuery = sqlQuery + key + ' = ?';
        userAttrs.push(Object.values(user)[index]);
    });

    sqlQuery = sqlQuery  + 'WHERE id = ?;';
    userAttrs.push(id);

    const [results, fields] = await connection.query(sqlQuery, userAttrs);

    connection.release();
}