import { MessageNotFoundError } from "../types/error";
import { EChatStatus } from "../types/shared_type/msg";
import pool, { sql } from "./dbUtils";

export async function insertChat(user1Id: number, user2Id: number) {
    const sqlQuery = sql`INSERT INTO userChats (
    user1Id,
    user2Id
    )
    VALUES (
        ${user1Id},
        ${user2Id}
    );`;

    const connection = await pool.getConnection();
    const [result] = await connection.query(sqlQuery);
    connection.release();

    return result.insertId;
}

export async function retrieveChatFromId(chatId: number) {
    const sqlQuery = sql`
    SELECT
        *
    FROM
        userChats
    WHERE (
        id = ${chatId}
    );`;

    const connection = await pool.getConnection();
    const [ rows ] = await connection.query(sqlQuery);
    connection.release();

    return rows[0];
}

export async function retrieveChatFromUsers(user1Id: number, user2Id: number) {
    const sqlQuery = sql`
    SELECT
        *
    FROM
        uniformizedChats
    WHERE (
        userId = ${user1Id} AND otherUserId = ${user2Id}
    );`;

    const connection = await pool.getConnection();
    const [ rows ] = await connection.query(sqlQuery);
    connection.release();

    return rows[0];
}

export async function insertMessage(chatId: number, userId: number, content: string, status: EChatStatus) {
    const sqlQuery = sql`
    INSERT INTO chatMessages (
        chatId,
        userId,
        status,
        content
    )
    VALUES (
        ${chatId},
        ${userId},
        ${status},
        ${content}
    );`;

    const connection = await pool.getConnection();
    await connection.query(sqlQuery);
    connection.release();
}

export async function updateMessageStatus(messageId: number, status: EChatStatus) {
    const sqlQuery = sql`
        UPDATE chatMessages SET
            status = ${EChatStatus}
        WHERE id = ${messageId}
    ;`;

    const connection = await pool.getConnection();
    const [result] = await connection.query(sqlQuery);
    connection.release();

    if (result.affectedRows == 0)
        throw new MessageNotFoundError();
    
}