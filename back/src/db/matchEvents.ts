import { IUserMatchEventDb } from "../types/matchEvents";
import { matchEventInput_t } from "../types/shared_type/matchEvents";
import pool, { sql } from "./dbUtils";

export async function insertMatchEvent(userId: number, matchEvent: matchEventInput_t) {
    const sqlQuery = sql`
        INSERT INTO userMatchEvents (
            user1Id,
            user2Id,
            title,
            eventDate,
            eventLocation,
            description
        )
        VALUES (
            ${userId},
            ${matchEvent.guestId},
            ${matchEvent.title},
            ${matchEvent.date},
            ${matchEvent.location},
            ${matchEvent.description}
        );
    `;

    const connection = await pool.getConnection();
    const [result] = await connection.query(sqlQuery);
    connection.release();

    if (!result) {
        return null;
    } else {
        return result.insertId;
    }
}

export async function retrieveMatchEvent(matchEventId: number) {
    const sqlQuery = sql`
    SELECT 
        JSON_OBJECT("id", ume.id, "user1Id", ume.user1Id, "user2Id", ume.user2Id, "title", ume.title, "eventDate", ume.eventDate, "eventLocation", ume.eventLocation, "description", ume.description) AS matchEvent
    FROM userMatchEvents ume
    WHERE ume.id = ${matchEventId};
`;

const connection = await pool.getConnection();
const [rows] = await connection.query<IUserMatchEventDb[]>(sqlQuery);
connection.release();

if (rows[0]) {
    rows[0] = {
        ...rows[0].matchEvent
    }
}

return rows[0];
}

export async function deleteMatchEvent(matchEventId: number) {
    const sqlQuery = sql`DELETE FROM userMatchEvents WHERE id = ${matchEventId};`;

    const connection = await pool.getConnection();
    const [result] = await connection.query(sqlQuery);
    connection.release();
}