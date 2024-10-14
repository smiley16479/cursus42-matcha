import { retrieveResearchedUsers } from "../db/research";
import { researchCriteerias } from "../types/shared_type/research";
import { IUserOutput } from "../types/shared_type/user";
import { IUserDb } from "../types/user";

export async function getResearchResults(userId: number, researchCriterias: researchCriteerias): Promise<IUserOutput[]> {
    const users: IUserDb[] = await retrieveResearchedUsers(userId, researchCriterias);

    return users;
}