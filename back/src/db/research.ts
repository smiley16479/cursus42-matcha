import { Sql } from "sql-template-tag";
import { ESortingType, ESortOn, IResearchCriterias } from "../types/shared_type/research";
import { IUserDb } from "../types/user";
import pool, { sql } from "./dbUtils";

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
            user_distance AS
            (
                SELECT
                    id AS user,
                    ST_Distance_Sphere(
                        POINT(latitude, longitude),
                        POINT(${criterias.locationLatitude}, ${criterias.locationLongitude})
                    ) AS distance
                FROM
                    users
            )

        SELECT
            fu.*,
            ud.distance AS distance
        FROM
            fullUsers fu
            LEFT JOIN user_distance ud ON ud.user = fu.id

        WHERE
            fu.id != ${userId}
            AND fu.id NOT IN (
                SELECT blocked FROM userBlocks WHERE blocker = ${userId}
            )
            AND fu.gender = ${criterias.requiredGender}
            AND fu.age BETWEEN ${criterias.minAge} AND ${criterias.maxAge}
            AND fu.fameRate BETWEEN ${criterias.minFameRate} AND ${criterias.maxFameRate}
            AND distance < ${criterias.maxDistance * 1000}
            AND JSON_CONTAINS(interests, JSON_ARRAY(${criterias.interests}))

        ${sortingSqlQuery}
        LIMIT ${criterias.nbRequiredProfiles}
        OFFSET ${criterias.offset};
    `;

    const [rows] = await connection.query<IUserDb[]>(sqlQuery);

    connection.release();
    return rows;
}