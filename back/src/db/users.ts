import pool, { cleanUserDb, sql } from './dbUtils';
import { EInterest, string2EInterest, IUserPictureInput } from '../types/shared_type/user';
import { IEmailConfirmToken, IUserInterest, IResetPasswordToken, IUserDb, IUserPicture, IUserVisitDb, IUserInputInternal, IUserLikeDb, IUserBlock, IUserReport, IUserNotifDb } from '../types/user'
import { QueryResult, FieldPacket } from 'mysql2';
import { Notif_t_E } from '../types/shared_type/notification';
import { UserNotFoundError } from '../types/error';


/*********************************************************
 * =================== USER MANAGEMENT ===================
 *********************************************************/

export async function insertUser(inputuser: IUserInputInternal): Promise<number | null> {

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
        ${inputuser.latitude},
        ${inputuser.longitude},
        ${inputuser.lastConnection},
        ${inputuser.profileVisibility},
        ${inputuser.emailNotifications},
        ${inputuser.maxDistance},
        ${inputuser.matchAgeMin},
        ${inputuser.matchAgeMax} 
    );`;

    const connection = await pool.getConnection();
    const [result] = await connection.query(sqlQuery);
    connection.release();

    if (!result) {
        return null;
    } else {
        return result.insertId;
    }
}

export async function retrieveUserFromId(id: number): Promise<IUserDb> {
    const sqlQuery = sql`
        SELECT *
        FROM fullUsers
        WHERE id = ${id};
    `;

    const connection = await pool.getConnection();
    const [rows] = await connection.query<IUserDb[]>(sqlQuery);
    connection.release();

    const user = cleanUserDb(rows[0]);

    return user;
}

export async function retrieveUserFromEmail(email: string): Promise<IUserDb> {
    const sqlQuery = sql`
        SELECT *
        FROM fullUsers
        WHERE email = ${email}
    `;

    const connection = await pool.getConnection();
    const [rows] = await connection.query<IUserDb[]>(sqlQuery);
    connection.release();

    const user = cleanUserDb(rows[0]);

    return user;
}

export async function retrieveUserFromUserName(userName: string): Promise<IUserDb> {

    const sqlQuery = sql`
        SELECT *
        FROM fullUsers
        WHERE BINARY userName = ${userName}
    `;

    const connection = await pool.getConnection();
    const [rows] = await connection.query<IUserDb[]>(sqlQuery);
    connection.release();

    const user = cleanUserDb(rows[0]);

    return user;
}

export async function retrieveAllUsers() {
    const sqlQuery = sql`
        SELECT *
        FROM fullUsers
    `;

    const connection = await pool.getConnection();
    const [rows] = await connection.query<IUserDb[]>(sqlQuery);
    connection.release();

    rows.forEach((user, index, array) => {
        array[index] = cleanUserDb(user);
    });

    return rows;
}

export async function deleteUser(id: number) {
    const sqlQuery = sql`DELETE FROM users WHERE id = ${id};`;

    const connection = await pool.getConnection();
    const [result] = await connection.query(sqlQuery);
    connection.release();

    if (result.affectedRows == 0)
        throw new UserNotFoundError();
}

export async function updateUser(id: number, rawUser: any) {
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

    const connection = await pool.getConnection();
    const [result] = await connection.query(sqlQuery, userAttrs);
    connection.release();

    if (result.affectedRows == 0)
        throw new UserNotFoundError();
}

/*********************************************************
 * =========== EMAIL VERIFICATION MANAGEMENT =============
 *********************************************************/

export async function insertEmailConfirmToken(userId: number, confirmToken: string) {
    const sqlQuery = sql`INSERT INTO emailConfirmTokens (
        userId,
        confirmToken
    )
    VALUES (
        ${userId},
        ${confirmToken}
    );`;

    const connection = await pool.getConnection();
    await connection.query(sqlQuery);
    connection.release();
}

export async function retrieveEmailConfirmationTokenFromToken(token: string): Promise<IEmailConfirmToken> {

    const sqlQuery = sql`SELECT * FROM emailConfirmTokens WHERE confirmToken = ${token};`;

    const connection = await pool.getConnection();
    const [rows] = await connection.query<IEmailConfirmToken[]>(sqlQuery);
    connection.release();

    return rows[0];
}

export async function deleteEmailConfirmationToken(id: number) {
    const sqlQuery = sql`DELETE FROM emailConfirmTokens WHERE id = ${id};`;

    const connection = await pool.getConnection();
    await connection.query(sqlQuery);
    connection.release();
}

/*********************************************************
 * ============== PASSWORD RESET MANAGEMENT ==============
 *********************************************************/

export async function insertResetPasswordToken(userId: number, resetToken: string) {
    const sqlQuery = sql`INSERT INTO resetPasswordTokens (
        userId,
        resetToken
    )
    VALUES (
        ${userId},
        ${resetToken}
    );`;

    const connection = await pool.getConnection();
    await connection.query(sqlQuery);
    connection.release();
}

export async function retrieveResetPasswordTokenFromToken(token: string): Promise<IResetPasswordToken> {
    const sqlQuery = sql`SELECT * FROM resetPasswordTokens WHERE resetToken = ${token};`;

    const connection = await pool.getConnection();
    const [rows] = await connection.query<IResetPasswordToken[]>(sqlQuery);
    connection.release();

    return rows[0];
}

export async function deleteResetPasswordToken(id: number) {
    const sqlQuery = sql`DELETE FROM resetPasswordTokens WHERE id = ${id};`;

    const connection = await pool.getConnection();
    await connection.query(sqlQuery);
    connection.release();
}

/*********************************************************
 * ============== USER INTERESTS MANAGEMENT ==============
 *********************************************************/

export async function updateUserInterests(userId: number, interests: string[]) {
    const retrieveUserInterestsSqlQuery = sql`
        SELECT * FROM userInterests WHERE
        userId = ${userId};
    `;

    const connection = await pool.getConnection();
    const [rows] = await connection.query<IUserInterest[]>(retrieveUserInterestsSqlQuery);
    connection.release();

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
}

export async function deleteUserInterests(userId: number) {
    const sqlQuery = sql`DELETE FROM userInterests WHERE userId = ${userId};`

    const connection = await pool.getConnection();
    await connection.query(sqlQuery);
    connection.release();
}

// Helpers

async function insertUserInterest(userId: number, interest: EInterest) {
    const insertUserInterestSqlQuery = sql`INSERT INTO userInterests (
        userId,
        interest
    )
    VALUES (
        ${userId},
        ${interest}
    );`;

    const connection = await pool.getConnection();
    await connection.query(insertUserInterestSqlQuery);
    connection.release();
}

async function deleteUserInterest(interestId: number) {

    const sqlQuery = sql`DELETE FROM userInterests WHERE id = ${interestId};`

    const connection = await pool.getConnection();
    await connection.query(sqlQuery);
    connection.release();
}

/*********************************************************
 * ================ PICTURE MANAGEMENT ===================
 *********************************************************/

export async function insertUserPicture(inputPicture: IUserPictureInput) {
    const sqlQuery = sql`INSERT INTO userPictures (
        userId,
        filename,
        pictureIndex
    )
    VALUES (
        ${inputPicture.userId},
        ${inputPicture.filename},
        ${inputPicture.pictureIndex}
    );`;

    const connection = await pool.getConnection();
    await connection.query(sqlQuery);
    connection.release();
}

export async function retrieveUserPictures(userId: number): Promise<IUserPicture[]> {
    const sqlQuery = sql`SELECT * FROM userPictures WHERE userId = ${userId};`;

    const connection = await pool.getConnection();
    const [rows] = await connection.query<IUserPicture[]>(sqlQuery);
    connection.release();

    return rows;
}

export async function retrieveUserPicture(userId: number, pictureIndex: number): Promise<IUserPicture> {
    const sqlQuery = sql`
        SELECT * FROM userPictures
        WHERE userId = ${userId}
        AND pictureIndex = ${pictureIndex};
    `;

    const connection = await pool.getConnection();
    const [rows] = await connection.query<IUserPicture[]>(sqlQuery);
    connection.release();

    return rows[0];
}

export async function deleteUserPictureById(userPictureId: number) {
    const sqlQuery = sql`DELETE FROM userPictures WHERE id = ${userPictureId};`;

    const connection = await pool.getConnection();
    await connection.query(sqlQuery);
    connection.release();
}

export async function deleteUserPictures(userId: number) {

    const sqlQuery = sql`DELETE FROM userPictures WHERE userId = ${userId};`;

    const connection = await pool.getConnection();
    await connection.query(sqlQuery);
    connection.release();
}

/*********************************************************
 * ================ VISITS MANAGEMENT ====================
 *********************************************************/

export async function retrieveUserVisitFromUsers(visitedUserId: number, visiterUserId: number) {
    const sqlQuery = sql`
        SELECT * FROM userVisits
        WHERE visitedUserId = ${visitedUserId}
        AND visiterUserId = ${visiterUserId}
    ;`;

    const connection = await pool.getConnection();
    const [rows] = await connection.query<IUserVisitDb[]>(sqlQuery);
    connection.release();

    return rows[0];
}

export async function retrieveUserVisitFromId(visitId: number) {
    const sqlQuery = sql`
        SELECT * FROM userVisits
        WHERE id = ${visitId}
    ;`;

    const connection = await pool.getConnection();
    const [rows] = await connection.query<IUserVisitDb[]>(sqlQuery);
    connection.release();

    return rows[0];
}

export async function insertUserVisit(visitedUserId: number, visiterUserId: number) {
    const sqlQuery = sql`INSERT INTO userVisits (
        visitedUserId,
        visiterUserId
    )
    VALUES (
        ${visitedUserId},
        ${visiterUserId}
    );`;

    const connection = await pool.getConnection();
    const [result] = await connection.query(sqlQuery);
    connection.release();

    if (!result) {
        return null;
    } else {
        return result.insertId;
    }
}

/*********************************************************
 * ================ LIKES MANAGEMENT =====================
 *********************************************************/

export async function retrieveUserLikeFromId(likeId: number) {
    const sqlQuery = sql`
        SELECT * FROM userLikes
        WHERE id = ${likeId}
    ;`

    const connection = await pool.getConnection();
    const [rows] = await connection.query<IUserLikeDb[]>(sqlQuery);
    connection.release();

    return rows[0];
}

export async function retrieveUserLikeFromUsers(likedUserId: number, likerUserId: number) {
    const sqlQuery = sql`
        SELECT * FROM userLikes
        WHERE likedUserId = ${likedUserId}
        AND likerUserId = ${likerUserId}
    ;`

    const connection = await pool.getConnection();
    const [rows] = await connection.query<IUserLikeDb[]>(sqlQuery);
    connection.release();

    return rows[0];
}

export async function insertUserLike(likedUserId: number, likerUserId: number) {
    const sqlQuery = sql`INSERT INTO userLikes (
        likedUserId,
        likerUserId
    )
    VALUES (
        ${likedUserId},
        ${likerUserId}
    );`

    const connection = await pool.getConnection();
    const [result] = await connection.query(sqlQuery);
    connection.release();

    if (!result) {
        return null;
    } else {
        return result.insertId;
    }
}

export async function deleteUserLike(likedUserId: number, likerUserId: number) {
    const sqlQuery = sql`
        DELETE FROM userLikes
        WHERE likedUserId = ${likedUserId}
        AND likerUserId = ${likerUserId}
    ;`;

    const connection = await pool.getConnection();
    await connection.query(sqlQuery);
    connection.release();
}

/*********************************************************
 * ================ BLOCKS MANAGEMENT =====================
 *********************************************************/

export async function retrieveUserBlockFromUsers(blockedUserId: number, blockerUserId: number) {
    const sqlQuery = sql`
        SELECT * FROM userBlocks
        WHERE blockedUserId = ${blockedUserId}
        AND blockerUserId = ${blockerUserId}
    ;`

    const connection = await pool.getConnection();
    const [rows] = await connection.query<IUserBlock[]>(sqlQuery);
    connection.release();

    return rows[0];
}

export async function insertUserBlock(blockedUserId: number, blockerUserId: number) {
    const sqlQuery = sql`INSERT INTO userBlocks (
        blockedUserId,
        blockerUserId
    )
    VALUES (
        ${blockedUserId},
        ${blockerUserId}
    );`

    const connection = await pool.getConnection();
    await connection.query(sqlQuery);
    connection.release();
}

export async function deleteUserBlock(blockedUserId: number, blockerUserId: number) {
    const sqlQuery = sql`
        DELETE FROM userBlocks
        WHERE blockedUserId = ${blockedUserId}
        AND blockerUserId = ${blockerUserId}
    ;`;

    const connection = await pool.getConnection();
    await connection.query(sqlQuery);
    connection.release();
}

/**********************************************************
 * ================ REPORTS MANAGEMENT ====================
 *********************************************************/

export async function retrieveUserReportFromUsers(reportedUserId: number, reporterUserId: number) {
    const sqlQuery = sql`
        SELECT * FROM userReports
        WHERE reportedUserId = ${reportedUserId}
        AND reporterUserId = ${reporterUserId}
    ;`

    const connection = await pool.getConnection();
    const [rows] = await connection.query<IUserReport[]>(sqlQuery);
    connection.release();

    return rows[0];
}

export async function insertUserReport(reportedUserId: number, reporterUserId: number) {
    const sqlQuery = sql`INSERT INTO userReports (
        reportedUserId,
        reporterUserId
    )
    VALUES (
        ${reportedUserId},
        ${reporterUserId}
    );`

    const connection = await pool.getConnection();
    await connection.query(sqlQuery);
    connection.release();
}


/*********************************************************
 * ============ NOTIFICATIONS MANAGEMENT =================
 *********************************************************/

export async function insertNotification(userId: number, involvedUserId: number, type: Notif_t_E, payloadId: number) {
    const sqlQuery = sql`INSERT INTO notifications (
        userId,
        involvedUserId,
        type,
        payloadId
    )
    VALUES (
        ${userId},
        ${involvedUserId},
        ${type},
        ${payloadId}
    );`

    const connection = await pool.getConnection();
    const [result] = await connection.query(sqlQuery);
    connection.release();

    if (!result) {
        return null;
    } else {
        return result.insertId;
    }
}

export async function deleteNotification(notifId: number) {
    const sqlQuery = sql`DELETE FROM notifications WHERE id = ${notifId};`;

    const connection = await pool.getConnection();
    await connection.query(sqlQuery);
    connection.release();

}

export async function retrieveNotificationFromId(notifId: number) {
    const sqlQuery = sql`SELECT * FROM notifications WHERE id = ${notifId}`

    const connection = await pool.getConnection();
    const [rows] = await connection.query<IUserNotifDb[]>(sqlQuery);
    connection.release();

    return rows[0];
}