import { IUserDb } from "../types/user";
import pool, { sql } from "./dbUtils";
import { ESortingType, ESortOn, IBrowseCriterias } from "../types/shared_type/browse";
import { Sql } from "sql-template-tag";

export async function retrieveMatchingUsers(user: IUserDb, criterias: IBrowseCriterias): Promise<IUserDb[]> {
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
            sortingSqlQuery = sql`ORDER BY nbCommonInterests`;
            break;
        case ESortOn.Score:
            sortingSqlQuery = sql`ORDER BY score`;
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
            ),
            user_common_interests AS
            (
                SELECT
                    fu.id AS user,
                    (
                        SELECT
                            COUNT(*)
                        FROM
                            JSON_TABLE(
                                CAST(fu.interests AS JSON),
                                '$[*]' COLUMNS(interest VARCHAR(255) PATH '$')
                            ) interestsTable
                        WHERE
                            JSON_CONTAINS(JSON_ARRAY(${user.interests}), JSON_QUOTE(interestsTable.interest))
                    ) AS nbCommonInterests
                FROM
                    fullUsers fu
            )
            
        SELECT
            fu.*,
            ud.distance AS distance,
            uci.nbCommonInterests AS nbCommonInterests,
            ((1 / (distance + 1)) + fameRate / 100 + nbCommonInterests / 30) AS score
        FROM
            fullUsers fu
            LEFT JOIN user_distance ud ON ud.user = fu.id
            LEFT JOIN user_common_interests uci ON uci.user = fu.id
        WHERE
            fu.id != ${user.id}
            AND fu.id NOT IN (
                SELECT blocked FROM userBlocks WHERE blocker = ${user.id}
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
    
    rows.forEach((row) => {
        delete row.score
    });

    connection.release();
    return (rows);
}