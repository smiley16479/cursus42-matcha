import pool, { sql } from './pool';
import { IUserDb, IUserInput } from '../types/user';


export async function insertUser(inputuser: IUserInput): Promise<number> {

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
    lastConnection)
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
    ${new Date(inputuser.lastConnection)}
    )`;

    const [result] = await connection.query(sqlQuery);
    connection.release();

    return result.insertId;
}

export async function retrieveUserFromId(id: number): Promise<IUserDb> {
    const connection = await pool.getConnection();

    const sqlQuery = `SELECT * FROM users WHERE id = ?`;
    const [rows] = await connection.query<IUserDb[]>(sqlQuery, [id]);

    connection.release();
    return rows[0];
}

export async function deleteUser(id: number) {
    const connection = await pool.getConnection();

    const sqlQuery = 'DELETE FROM users WHERE id = ?';
    await connection.query(sqlQuery, id);

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

    sqlQuery = sqlQuery + 'WHERE id = ?;';
    userAttrs.push(id);

    await connection.query(sqlQuery, userAttrs);

    connection.release();
}