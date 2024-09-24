import pool, { sql } from './pool';
import { IEmailConfirmToken, IUserDb, IUserInput } from '../types/user';
import { QueryResult, FieldPacket } from 'mysql2';


export async function insertUser(inputuser: IUserInput): Promise<number | null> {

    const connection = await pool.getConnection();

    const sqlQuery = sql`INSERT INTO users (
        email,
        emailVerified,
        firstName,
        lastName,
        password,
        gender,
        sexualPref,
        biography,
        fameRate,
        latitude,
        longitude,
        lastConnection
    )
    VALUES (
        ${inputuser.email},
        ${inputuser.emailVerified},
        ${inputuser.firstName},
        ${inputuser.lastName},
        ${inputuser.password},
        ${inputuser.gender},
        ${inputuser.sexualPref},
        ${inputuser.biography},
        ${inputuser.fameRate},
        ${inputuser.longitude},
        ${inputuser.latitude},
        ${inputuser.lastConnection}
    )`;

    let result: [QueryResult, FieldPacket[]];

    try {
        result = await connection.query(sqlQuery);
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }

    if (!result[0]) {
        return null;
    } else {
        return result[0].insertId;
    }
}

export async function retrieveUserFromId(id: number): Promise<IUserDb> {
    const connection = await pool.getConnection();

    const sqlQuery = sql`SELECT * FROM users WHERE id = ${id}`;
    const [rows] = await connection.query<IUserDb[]>(sqlQuery);

    connection.release();
    return rows[0];
}

export async function deleteUser(id: number) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`DELETE FROM users WHERE id = ${id}`;
    const [result] = await connection.query(sqlQuery);
    if (result.affectedRows == 0)
        throw new Error();

    connection.release();
}

export async function updateUser(id: number, rawUser: any) {
    const connection = await pool.getConnection();

    let sqlQuery = 'UPDATE users SET ';
    let userAttrs: any[] = [];

    Object.keys(rawUser).forEach((key: string, index: number) => {
        if (index != 0) {
            sqlQuery = sqlQuery + ', '
        }
        sqlQuery = sqlQuery + key + ' = ?';
        userAttrs.push(Object.values(rawUser)[index]);
    });

    sqlQuery = sqlQuery + ' WHERE id = ?;';
    userAttrs.push(id);

    const [result] = await connection.query(sqlQuery, userAttrs);
    if (result.affectedRows == 0)
        throw new Error();

    connection.release();
}

export async function insertEmailConfirmToken(userId: number, confirmToken: string) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`INSERT INTO emailConfirmTokens (
        user,
        confirmToken
    )
    VALUES (
        ${userId},
        ${confirmToken}
    )`;

    await connection.query(sqlQuery);

    connection.release();
}

export async function retrieveEmailConfirmationTokenFromToken(token: string): Promise<IEmailConfirmToken> {
    const connection = await pool.getConnection();

    const sqlQuery = sql`SELECT * FROM emailConfirmTokens WHERE confirmToken = ${token}`;
    const [rows] = await connection.query<IEmailConfirmToken[]>(sqlQuery);

    connection.release();
    return rows[0];
}

export async function deleteEmailConfirmationToken(id: number) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`DELETE FROM emailConfirmTokens WHERE id = ${id}`;
    await connection.query(sqlQuery);

    connection.release();
}