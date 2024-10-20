import mysql from 'mysql2';
import { PoolConnection } from 'mysql2/promise';
import sql from 'sql-template-tag';
import { IUserDb } from '../types/user';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();

let connection: PoolConnection;
let isDbReachable: boolean = false;

do {
    try {
        connection = await pool.getConnection();
        connection.release();
        isDbReachable = true;
    } catch (error) {
        isDbReachable = false;
        console.log("Cannot connect to database, retrying in 1 second");
        // Wait 1 sec
        await new Promise(f => setTimeout(f, 1000));
    }
} while (!isDbReachable)

console.log("Connected to database");

export default pool;

export const userInterestsCTE = sql`
    user_interests AS (
    SELECT ui.user, JSON_ARRAYAGG(ui.interest) AS interests
    FROM userInterests ui
    GROUP BY ui.user
)`

export const userPicturesCTE = sql`
    user_pictures AS (
    SELECT up.user, JSON_ARRAYAGG(JSON_OBJECT("filename", up.filename, "pictureIndex", up.pictureIndex)) AS pictures
    FROM userPictures up
    GROUP BY up.user
)`
export const userVisitsCTE = sql`
    user_visits AS (
    SELECT uv.visited, JSON_ARRAYAGG(JSON_OBJECT("date", uv.createdAt, "visiterId", uv.visiter)) AS visits
    FROM userVisits uv
    GROUP BY uv.visited
)`
export const userLikesCTE = sql`
    user_likes AS (
    SELECT ul.liked, JSON_ARRAYAGG(JSON_OBJECT("date", ul.createdAt, "likerId", ul.liker)) AS likes
    FROM userLikes ul
    GROUP BY ul.liked
)`
export const userNotificationsCTE = sql`
    user_notifications AS (
    SELECT n.user, JSON_ARRAYAGG(JSON_OBJECT("date", n.createdAt, "involvedUser", n.involvedUser, "type", n.type, "isRead", n.isRead)) AS notifications
    FROM notifications n
    GROUP BY n.user
)`

export function cleanUserDb(user: IUserDb) {
    if (!user)
        return user;
    if (user.interests === null)
        user.interests = [];
    if (user.pictures === null)
        user.pictures = []
    if (user.visits === null)
        user.visits = []
    if (user.likes === null)
        user.likes = []
    if (user.notifications === null)
        user.notifications = []
    return user;
}

export { default as sql } from 'sql-template-tag';