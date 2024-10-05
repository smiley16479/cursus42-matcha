import pool, { sql } from './pool';
import { EInterest, string2EInterest, IUserPictureInput } from '../types/shared_type/user';
import { IEmailConfirmToken, IUserInterest, IResetPasswordToken, IUserDb, IUserPicture, IUserVisit, IUserInputInternal } from '../types/user'
import { QueryResult, FieldPacket } from 'mysql2';


/*********************************************************
 * =================== USER MANAGEMENT ===================
 *********************************************************/

export async function insertUser(inputuser: IUserInputInternal): Promise<number | null> {

    const connection = await pool.getConnection();
    const sqlQuery = sql`INSERT INTO users (
        email,
        emailVerified,
        userName,
        firstName,
        lastName,
        password,
        gender,
        sexualPref,
        age,
        biography,
        fameRate,
        latitude,
        longitude,
        lastConnection,
        profileVisibility,
        emailNotifications,
        maxDistance,
        matchAgeMin,
        matchAgeMax 
    )
    VALUES (
        ${inputuser.email},
        ${inputuser.emailVerified},
        ${inputuser.userName},
        ${inputuser.firstName},
        ${inputuser.lastName},
        ${inputuser.password},
        ${inputuser.gender},
        ${inputuser.sexualPref},
        ${inputuser.age},
        ${inputuser.biography},
        ${inputuser.fameRate},
        ${inputuser.longitude},
        ${inputuser.latitude},
        ${inputuser.lastConnection},
        ${inputuser.profileVisibility},
        ${inputuser.emailNotifications},
        ${inputuser.maxDistance},
        ${inputuser.matchAgeMin},
        ${inputuser.matchAgeMax} 
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
    SELECT u.*,
        COALESCE((SELECT JSON_ARRAYAGG(ui.interest)
        FROM userInterests ui
        WHERE ui.user = u.id), JSON_ARRAY()) AS interests,

        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT("filename", up.filename, "pictureIndex", up.pictureIndex))
        FROM userPictures up
        WHERE up.user = u.id), JSON_ARRAY()) AS pictures,

        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT("date", uv.createdAt, "visiterId", uv.visiter))
        FROM userVisits uv
        WHERE uv.visited = u.id), JSON_ARRAY()) AS visits

    FROM users u
    WHERE u.id = ${id};
    `;

    const [rows] = await connection.query<IUserDb[]>(sqlQuery);

    connection.release();
    return rows[0];
}

export async function retrieveUserFromEmail(email: string): Promise<IUserDb> {
    const connection = await pool.getConnection();

    const sqlQuery = sql`
    SELECT u.*,
        COALESCE((SELECT JSON_ARRAYAGG(ui.interest)
        FROM userInterests ui
        WHERE ui.user = u.id), JSON_ARRAY()) AS interests,

        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT("filename", up.filename, "pictureIndex", up.pictureIndex))
        FROM userPictures up
        WHERE up.user = u.id), JSON_ARRAY()) AS pictures,

        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT("date", uv.createdAt, "visiterId", uv.visiter))
        FROM userVisits uv
        WHERE uv.visited = u.id), JSON_ARRAY()) AS visits

    FROM users u
    WHERE u.email = ${email}
    GROUP BY u.id;
    `;

    const [rows] = await connection.query<IUserDb[]>(sqlQuery);

    connection.release();
    return rows[0];
}

export async function retrieveUserFromUserName(userName: string): Promise<IUserDb> {
    const connection = await pool.getConnection();

    const sqlQuery = sql`
    SELECT u.*,
        COALESCE((SELECT JSON_ARRAYAGG(ui.interest)
        FROM userInterests ui
        WHERE ui.user = u.id), JSON_ARRAY()) AS interests,

        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT("filename", up.filename, "pictureIndex", up.pictureIndex))
        FROM userPictures up
        WHERE up.user = u.id), JSON_ARRAY()) AS pictures,

        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT("date", uv.createdAt, "visiterId", uv.visiter))
        FROM userVisits uv
        WHERE uv.visited = u.id), JSON_ARRAY()) AS visits
        
    FROM users u
    WHERE BINARY u.userName = ${userName}
    GROUP BY u.id;
    `;

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
    const connection = await pool.getConnection();

    const retrieveUserInterestsSqlQuery = sql`
    SELECT * FROM userInterests WHERE
    user = ${userId};
    `;

    const [rows] = await connection.query<IUserInterest[]>(retrieveUserInterestsSqlQuery);

    interests.forEach((interest) => {
        const interestsFromDb = rows.find(elem => elem.interest === interest);
        if (interestsFromDb) {
            interestsFromDb.id = -1;
            return;
        }
        insertUserInterest(userId, string2EInterest(interest));
    });

    rows.forEach((interest) => {
        if (interest.id != -1)
            deleteUserInterest(interest.id);
    })

    connection.release();
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

async function deleteUserInterest(interestId: number) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`DELETE FROM userInterests WHERE id = ${interestId};`

    await connection.query(sqlQuery);

    connection.release();
}

/*********************************************************
 * ================ PICTURE MANAGEMENT ===================
 *********************************************************/

export async function insertUserPicture(inputPicture: IUserPictureInput) {
    const connection = await pool.getConnection();

    console.log(`inputPicture`, inputPicture);
    const sqlQuery = sql`INSERT INTO userPictures (
        user,
        filename,
        pictureIndex
    )
    VALUES (
        ${inputPicture.user},
        ${inputPicture.filename},
        ${inputPicture.pictureIndex}
    );`;

    await connection.query(sqlQuery);
    connection.release();
}

export async function retrieveUserPictures(userId: number): Promise<IUserPicture[]> {
    const connection = await pool.getConnection();

    const sqlQuery = sql`SELECT * FROM userPictures WHERE user = ${userId};`;

    const [rows] = await connection.query<IUserPicture[]>(sqlQuery);

    connection.release();
    return rows;
}

export async function retrieveUserPicture(userId: number, pictureIndex: number): Promise<IUserPicture> {
    const connection = await pool.getConnection();

    const sqlQuery = sql`
        SELECT * FROM userPictures
        WHERE user = ${userId}
        AND pictureIndex = ${pictureIndex};
    `;

    const [rows] = await connection.query<IUserPicture[]>(sqlQuery);

    connection.release();
    return rows[0];
}

export async function deleteUserPictureById(userPictureId: number) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`DELETE FROM userPictures WHERE id = ${userPictureId};`;

    await connection.query(sqlQuery);

    connection.release();
}

export async function deleteUserPictures(userId: number) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`DELETE FROM userPictures WHERE user = ${userId};`;

    await connection.query(sqlQuery);

    connection.release();
}

/*********************************************************
 * ================ VISITS MANAGEMENT ====================
 *********************************************************/

export async function retrieveUserVisitFromUsers(visitedUserId: number, visiterUserId: number) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`
        SELECT * FROM userVisits
        WHERE visited = ${visitedUserId}
        AND visiter = ${visiterUserId}
        ;`

    const [rows] = await connection.query<IUserVisit[]>(sqlQuery);

    connection.release();
    return rows[0];
}

export async function insertUserVisit(visitedUserId: number, visiterUserId: number) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`INSERT INTO userVisits (
        visited,
        visiter
    )
    VALUES (
        ${visitedUserId},
        ${visiterUserId}
    );`

    await connection.query(sqlQuery);

    connection.release();
}