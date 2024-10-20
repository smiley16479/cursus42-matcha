import { IResearchCriterias } from "../types/shared_type/research";
import { IUserDb } from "../types/user";
import pool, { sql, userInterestsCTE, userPicturesCTE } from "./dbUtils";

export async function retrieveResearchedUsers(userId: number, criterias: IResearchCriterias): Promise<IUserDb[]> {
    const connection = await pool.getConnection();

    console.log(criterias)

    const sqlQuery = sql`
        WITH
            ${userInterestsCTE},
            ${userPicturesCTE}
        SELECT u.*,
            ui.interests AS interests,
            up.pictures AS pictures
        FROM users u
            LEFT JOIN user_interests ui ON ui.user = u.id
            LEFT JOIN user_pictures up ON up.user = u.id
        WHERE
            u.id != ${userId}
            AND u.id NOT IN (
                SELECT blocked FROM userBlocks WHERE blocker = ${userId}
            )
            AND u.gender = ${criterias.requiredGender}
            AND u.age BETWEEN ${criterias.minAge} AND ${criterias.maxAge}
            AND u.fameRate BETWEEN ${criterias.minFameRate} AND ${criterias.maxFameRate}
            AND ST_Distance_Sphere(
                POINT(u.latitude, u.longitude),
                POINT(${criterias.locationLatitude}, ${criterias.locationLongitude})
            )
            < ${criterias.maxDistance * 1000}
            AND JSON_CONTAINS(ui.interests, JSON_ARRAY(${criterias.interests}))
        LIMIT 20;
    `;

    const [rows] = await connection.query<IUserDb[]>(sqlQuery);

    connection.release();
    return rows;
}