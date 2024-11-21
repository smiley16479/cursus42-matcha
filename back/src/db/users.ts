import pool, { cleanUserDb, sql } from './dbUtils';
import { EInterest, string2EInterest, IUserPictureInput } from '../types/shared_type/user';
import { IEmailConfirmToken, IUserInterest, IResetPasswordToken, IUserDb, IUserPicture, IUserVisit, IUserInputInternal, IUserLike, IUserBlock, IUserReport } from '../types/user'
import { QueryResult, FieldPacket } from 'mysql2';
import { Notif_t_E } from '../types/shared_type/notification';
import { UserNotFoundError } from '../types/error';


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
        ${inputuser.latitude},
        ${inputuser.longitude},
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
        SELECT *
        FROM fullUsers
        WHERE id = ${id};
    `;

    const [rows] = await connection.query<IUserDb[]>(sqlQuery);

    const user = cleanUserDb(rows[0]);

    connection.release();
    return user;
}

export async function retrieveUserFromEmail(email: string): Promise<IUserDb> {
    const connection = await pool.getConnection();

    const sqlQuery = sql`
        SELECT *
        FROM fullUsers
        WHERE email = ${email}
    `;

    const [rows] = await connection.query<IUserDb[]>(sqlQuery);

    const user = cleanUserDb(rows[0]);

    connection.release();
    return user;
}

export async function retrieveUserFromUserName(userName: string): Promise<IUserDb> {
    const connection = await pool.getConnection();

    const sqlQuery = sql`
        SELECT *
        FROM fullUsers
        WHERE BINARY userName = ${userName}
    `;

    const [rows] = await connection.query<IUserDb[]>(sqlQuery);

    const user = cleanUserDb(rows[0]);

    connection.release();
    return user;
}

export async function deleteUser(id: number) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`DELETE FROM users WHERE id = ${id};`;
    const [result] = await connection.query(sqlQuery);
    if (result.affectedRows == 0)
        throw new UserNotFoundError();

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
        throw new UserNotFoundError();

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

/*********************************************************
 * ================ LIKES MANAGEMENT =====================
 *********************************************************/

export async function retrieveUserLikeFromUsers(likedUserId: number, likerUserId: number) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`
        SELECT * FROM userLikes
        WHERE liked = ${likedUserId}
        AND liker = ${likerUserId}
    ;`

    const [rows] = await connection.query<IUserLike[]>(sqlQuery);

    connection.release();
    return rows[0];
}

export async function insertUserLike(likedUserId: number, likerUserId: number) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`INSERT INTO userLikes (
        liked,
        liker
    )
    VALUES (
        ${likedUserId},
        ${likerUserId}
    );`

    await connection.query(sqlQuery);

    connection.release();
}

export async function deleteUserLike(likedUserId: number, likerUserId: number) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`
        DELETE FROM userLikes
        WHERE liked = ${likedUserId}
        AND liker = ${likerUserId}
    ;`;

    await connection.query(sqlQuery);

    connection.release();
}

/*********************************************************
 * ================ BLOCKS MANAGEMENT =====================
 *********************************************************/

export async function retrieveUserBlockFromUsers(blockedUserId: number, blockerUserId: number) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`
        SELECT * FROM userBlocks
        WHERE blocked = ${blockedUserId}
        AND blocker = ${blockerUserId}
    ;`

    const [rows] = await connection.query<IUserBlock[]>(sqlQuery);

    connection.release();
    return rows[0];
}

export async function insertUserBlock(blockedUserId: number, blockerUserId: number) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`INSERT INTO userBlocks (
        blocked,
        blocker
    )
    VALUES (
        ${blockedUserId},
        ${blockerUserId}
    );`

    await connection.query(sqlQuery);

    connection.release();
}

export async function deleteUserBlock(blockedUserId: number, blockerUserId: number) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`
        DELETE FROM userBlocks
        WHERE blocked = ${blockedUserId}
        AND blocker = ${blockerUserId}
    ;`;

    await connection.query(sqlQuery);

    connection.release();
}

/**********************************************************
 * ================ REPORTS MANAGEMENT ====================
 *********************************************************/

export async function retrieveUserReportFromUsers(reportedUserId: number, reporterUserId: number) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`
        SELECT * FROM userReports
        WHERE reported = ${reportedUserId}
        AND reporter = ${reporterUserId}
    ;`

    const [rows] = await connection.query<IUserReport[]>(sqlQuery);

    connection.release();
    return rows[0];
}

export async function insertUserReport(reportedUserId: number, reporterUserId: number) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`INSERT INTO userReports (
        reported,
        reporter
    )
    VALUES (
        ${reportedUserId},
        ${reporterUserId}
    );`

    await connection.query(sqlQuery);

    connection.release();
}


/*********************************************************
 * ============ NOTIFICATIONS MANAGEMENT =================
 *********************************************************/

export async function insertNotification(userId: number, involvedUserId: number, type: Notif_t_E, isRead: boolean) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`INSERT INTO notifications (
        user,
        involvedUser,
        type,
        isRead
    )
    VALUES (
        ${userId},
        ${involvedUserId},
        ${type},
        ${isRead}
    );`

    await connection.query(sqlQuery);

    connection.release();
}

export async function updateNotificationRead(notifId: number) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`UPDATE notifications SET isRead = true WHERE id = ${notifId};`;

    await connection.query(sqlQuery);

    connection.release();
}

export async function deleteNotification(notifId: number) {
    const connection = await pool.getConnection();

    const sqlQuery = sql`DELETE FROM notifications WHERE id = ${notifId};`;

    await connection.query(sqlQuery);

    connection.release();

}