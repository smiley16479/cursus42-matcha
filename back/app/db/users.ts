import pool, { sql } from './pool';
import { EInterest, IEmailConfirmToken, IInterest, IResetPasswordToken, IUserDb, IUserInput, string2EInterest } from '../types/user';
import { QueryResult, FieldPacket } from 'mysql2';


/*********************************************************
 * =================== USER MANAGEMENT ===================
 *********************************************************/

export async function insertUser(inputuser: IUserInput): Promise<number | null> {

    const connection = await pool.getConnection();

    const sqlQuery = sql`INSERT INTO users (
        email,
        emailVerified,
        username,
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
        ${inputuser.username},
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
    );`;

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

    const sqlQuery = sql`
    SELECT u.*, JSON_ARRAYAGG(ui.interest) AS interests
    FROM users u
    LEFT JOIN userInterests ui ON u.id = ui.user
    WHERE u.id = ${id};
    `;

    const [rows] = await connection.query<IUserDb[]>(sqlQuery);

    connection.release();
    return rows[0];
}

export async function retrieveUserFromEmail(email: string): Promise<IUserDb> {
    const connection = await pool.getConnection();

    const sqlQuery = sql`SELECT * FROM users WHERE email = ${email};`;
    const [rows] = await connection.query<IUserDb[]>(sqlQuery);

    connection.release();
    return rows[0];
}

export async function retrieveUserFromUsername(username: string): Promise<IUserDb> {
    const connection = await pool.getConnection();

    const sqlQuery = sql`SELECT * FROM users WHERE BINARY username = ${username};`;
    const [rows] = await connection.query<IUserDb[]>(sqlQuery);

    connection.release();
    return rows[0];
}

export async function deleteUser(id: number) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`DELETE FROM users WHERE id = ${id};`;
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
        if (key == "interests")
            return;
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

/*********************************************************
 * =========== EMAIL VERIFICATION MANAGEMENT =============
 *********************************************************/

export async function insertEmailConfirmToken(userId: number, confirmToken: string) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`INSERT INTO emailConfirmTokens (
        user,
        confirmToken
    )
    VALUES (
        ${userId},
        ${confirmToken}
    );`;

    await connection.query(sqlQuery);

    connection.release();
}

export async function retrieveEmailConfirmationTokenFromToken(token: string): Promise<IEmailConfirmToken> {
    const connection = await pool.getConnection();

    const sqlQuery = sql`SELECT * FROM emailConfirmTokens WHERE confirmToken = ${token};`;
    const [rows] = await connection.query<IEmailConfirmToken[]>(sqlQuery);

    connection.release();
    return rows[0];
}

export async function deleteEmailConfirmationToken(id: number) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`DELETE FROM emailConfirmTokens WHERE id = ${id};`;
    await connection.query(sqlQuery);

    connection.release();
}

/*********************************************************
 * ============== PASSWORD RESET MANAGEMENT ==============
 *********************************************************/

export async function insertResetPasswordToken(userId: number, resetToken: string) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`INSERT INTO resetPasswordTokens (
        user,
        resetToken
    )
    VALUES (
        ${userId},
        ${resetToken}
    );`;

    await connection.query(sqlQuery);

    connection.release();
}

export async function retrieveResetPasswordTokenFromToken(token: string): Promise<IResetPasswordToken> {
    const connection = await pool.getConnection();

    const sqlQuery = sql`SELECT * FROM resetPasswordTokens WHERE resetToken = ${token};`;
    const [rows] = await connection.query<IResetPasswordToken[]>(sqlQuery);

    connection.release();
    return rows[0];
}

export async function deleteResetPasswordToken(id: number) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`DELETE FROM resetPasswordTokens WHERE id = ${id};`;
    await connection.query(sqlQuery);

    connection.release();
}

/*********************************************************
 * ============== USER INTERESTS MANAGEMENT ==============
 *********************************************************/

export async function updateUserInterests(userId: number, interests: string[]) {
    interests.forEach((interest) => {
        insertUserInterest(userId, string2EInterest(interest));
    });
}

export async function deleteUserInterests(userId: number) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`DELETE FROM userInterests WHERE user = ${userId};`

    await connection.query(sqlQuery);

    connection.release();
}

// Helpers

async function insertUserInterest(userId: number, interest: EInterest) {
    const connection = await pool.getConnection();

    const retrieveUserInterestSqlQuery = sql`
    SELECT id FROM userInterests WHERE
    user = ${userId}
    AND interest = ${interest};
    `;

    const [rows] = await connection.query<IInterest[]>(retrieveUserInterestSqlQuery);
    if (rows.length != 0)
        return;

    const insertUserInterestSqlQuery = sql`INSERT INTO userInterests (
        user,
        interest
    )
    VALUES (
        ${userId},
        ${interest}
    );`;

    await connection.query(insertUserInterestSqlQuery);

    connection.release();
}