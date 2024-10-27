import { Sql } from "sql-template-tag";
import { ESortingType, ESortOn, IResearchCriterias } from "../types/shared_type/research";
import { IUserDb } from "../types/user";
import pool, { sql, userInterestsCTE, userPicturesCTE } from "./dbUtils";

export async function retrieveResearchedUsers(userId: number, criterias: IResearchCriterias): Promise<IUserDb[]> {
    const connection = await pool.getConnection();

    let sortingSqlQuery: Sql;

    switch (criterias.sortingOn) {
        case ESortOn.Age:
            sortingSqlQuery = sql`ORDER BY age`;
            break;
        case ESortOn.Distance:
            sortingSqlQuery = sql`ORDER BY distance`;
            break;
        case ESortOn.FameRate:
            sortingSqlQuery = sql`ORDER BY fameRate`;
            break;
        case ESortOn.Interests:
            sortingSqlQuery = sql`ORDER BY Interests`;
            break;
    }

    switch(criterias.sortingType) {
        case ESortingType.Ascending:
            sortingSqlQuery = sql`${sortingSqlQuery} ASC`;
            break;
        case ESortingType.Descending:
            sortingSqlQuery = sql`${sortingSqlQuery} DESC`;
            break;
    }

    const sqlQuery = sql`
        WITH
            ${userInterestsCTE},
            ${userPicturesCTE}
        SELECT u.*,
            ui.interests AS interests,
            up.pictures AS pictures,
            ST_Distance_Sphere(
                POINT(u.latitude, u.longitude),
                POINT(${criterias.locationLatitude}, ${criterias.locationLongitude})
            ) AS distance
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
            AND JSON_CONTAINS(ui.interests, JSON_ARRAY(${criterias.interests}))
            AND ST_Distance_Sphere(
                POINT(u.latitude, u.longitude),
                POINT(${criterias.locationLatitude}, ${criterias.locationLongitude})
            )
            < ${criterias.maxDistance * 1000}

        ${sortingSqlQuery}
        LIMIT ${criterias.nbRequiredProfiles}
        OFFSET ${criterias.offset};
    `;

    const [rows] = await connection.query<IUserDb[]>(sqlQuery);

    connection.release();
    return rows;
}