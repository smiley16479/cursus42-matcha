import { Sql } from "sql-template-tag";
import { ESortingType, ESortOn, IResearchCriterias } from "../types/shared_type/research";
import { IUserDb } from "../types/user";
import pool, { cleanUserDb, sql } from "./dbUtils";
import { EGender, ESexualPref } from "../types/shared_type/user";

export async function retrieveResearchedUsers(user: IUserDb, criterias: IResearchCriterias): Promise<IUserDb[]> {
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
    }

    switch(criterias.sortingType) {
        case ESortingType.Ascending:
            sortingSqlQuery = sql`${sortingSqlQuery} ASC`;
            break;
        case ESortingType.Descending:
            sortingSqlQuery = sql`${sortingSqlQuery} DESC`;
            break;
    }

    let requiredGenderSqlQuery: Sql;

    switch(criterias.sexualPref) {
        case ESexualPref.Female:
            requiredGenderSqlQuery = sql`AND fu.gender = ${EGender.Female}`;
            break;
        case ESexualPref.Male:
            requiredGenderSqlQuery = sql`AND fu.gender = ${EGender.Male}`;
            break;
        case ESexualPref.Both:
            requiredGenderSqlQuery = sql``;
            break;
    }

    const sqlQuery = sql`
        WITH
            user_distance AS
            (
                SELECT
                    id AS userId,
                    ST_Distance_Sphere(
                        POINT(latitude, longitude),
                        POINT(${criterias.latitude}, ${criterias.longitude})
                    ) AS distance
                FROM
                    users
            ),
            user_common_interests AS
            (
                SELECT
                    fu.id AS userId,
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
            uci.nbCommonInterests AS nbCommonInterests
        FROM
            fullUsers fu
            LEFT JOIN user_distance ud ON ud.userId = fu.id
            LEFT JOIN user_common_interests uci ON uci.userId = fu.id

        WHERE
            fu.id != ${user.id}
            AND (NOT JSON_CONTAINS(JSON_EXTRACT(${JSON.stringify(user.blocking)}, '$[*].blockedUserId'), JSON_ARRAY(fu.id)) OR JSON_LENGTH(${JSON.stringify(user.blocking)}) = 0)
            ${requiredGenderSqlQuery}
            AND fu.age BETWEEN ${criterias.matchAgeMin} AND ${criterias.matchAgeMax}
            AND fu.fameRate BETWEEN ${criterias.minFameRate} AND ${criterias.maxFameRate}
            AND distance < ${criterias.maxDistance * 1000}
            AND (JSON_CONTAINS(interests, JSON_ARRAY(${criterias.interests})) OR JSON_LENGTH(JSON_ARRAY(${criterias.interests})) = 0)

        ${sortingSqlQuery}
        LIMIT ${criterias.nbRequiredProfiles}
        OFFSET ${criterias.offset};
    `;

    const [rows] = await connection.query<IUserDb[]>(sqlQuery);

    rows.forEach((user, index, array) => {
        array[index] = cleanUserDb(user);
    });

    connection.release();
    return rows;
}