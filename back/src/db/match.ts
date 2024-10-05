import { Sql } from "sql-template-tag";
import { EGender, ESexualPref } from "../types/shared_type/user";
import { IUserDb } from "../types/user";
import pool, { sql } from "./pool";

export async function retrieveMatchingUsers(user: IUserDb): Promise<IUserDb[]> {
    const connection = await pool.getConnection();
    
    let genderFilterSqlQuery: Sql;

    switch (user.sexualPref) {
        case ESexualPref.Female:
            genderFilterSqlQuery = sql`WHERE u.gender = ${EGender.Female}`;
            break;
        case ESexualPref.Male:
            genderFilterSqlQuery = sql`WHERE u.gender = ${EGender.Male}`;
            break;
        case ESexualPref.Both:
            genderFilterSqlQuery = sql`WHERE u.gender = 
                ${EGender.Male}
                OR u.gender = ${EGender.Female}
                OR u.gender = ${EGender.Unknown}
            `;
            break;
    }

    const sqlQuery = sql`
        SELECT u.*,
            fameRate AS score,

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
        ${genderFilterSqlQuery} AND u.id != ${user.id}
        GROUP BY u.id
        ORDER BY score DESC
        LIMIT 20;
    `;
    
    const [rows] = await connection.query<IUserDb[]>(sqlQuery);
    console.log(rows);

    connection.release();
    return (rows);
}