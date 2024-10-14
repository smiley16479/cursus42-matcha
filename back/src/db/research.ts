import { IResearchCriterias } from "../types/shared_type/research";
import { IUserDb } from "../types/user";
import pool, { interestsAggregationSubQuery, picturesAggregationSubQuery, sql } from "./dbUtils";

export async function retrieveResearchedUsers(userId: number, criterias: IResearchCriterias): Promise<IUserDb[]> {
    const connection = await pool.getConnection();

    const sqlQuery = sql`
        SELECT u.*,
            ${interestsAggregationSubQuery},
            ${picturesAggregationSubQuery}
        FROM users u
        WHERE u.id != ${userId}
        AND u.id NOT IN (
            SELECT blocked FROM userBlocks WHERE blocker = ${userId}
        )
        AND u.age BETWEEN ${criterias.minAge} AND ${criterias.maxAge}
        AND u.fameRate BETWEEN ${criterias.minFameRate} AND ${criterias.maxFameRate}
    `;

    const [rows] = await connection.query<IUserDb[]>(sqlQuery);

    connection.release();
    return rows;
}