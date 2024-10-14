import mysql from 'mysql2';
import { PoolConnection } from 'mysql2/promise';
import sql from 'sql-template-tag';

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

export const interestsAggregationSubQuery = sql`
    COALESCE((SELECT JSON_ARRAYAGG(ui.interest)
    FROM userInterests ui
    WHERE ui.user = u.id), JSON_ARRAY()) AS interests
`;

export const picturesAggregationSubQuery = sql`
    COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT("filename", up.filename, "pictureIndex", up.pictureIndex))
    FROM userPictures up
    WHERE up.user = u.id), JSON_ARRAY()) AS pictures
`;

export const visitsAggregationSubQuery = sql`
    COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT("date", uv.createdAt, "visiterId", uv.visiter))
    FROM userVisits uv
    WHERE uv.visited = u.id), JSON_ARRAY()) AS visits
`;

export const likesAggregationSubQuery = sql`
    COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT("date", ul.createdAt, "likerId", ul.liker))
    FROM userLikes ul
    WHERE ul.liked = u.id), JSON_ARRAY()) AS likes
`;

export const notificationsAggregationSubQuery = sql`
    COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT("date", n.createdAt, "involvedUser", n.involvedUser, "type", n.type, "isRead", n.isRead))
    FROM notifications n
    WHERE n.user = u.id), JSON_ARRAY()) AS notifications
`;

export default pool;
export { default as sql } from 'sql-template-tag';