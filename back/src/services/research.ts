import { retrieveResearchedUsers } from "../db/research";
import { IResearchCriterias } from "../types/shared_type/research";
import { IUserOutput } from "../types/shared_type/user";
import { IUserDb } from "../types/user";
import { sanitizeUserForOutput } from "./users";

export async function getResearchResults(userId: number, researchCriterias: IResearchCriterias): Promise<IUserOutput[]> {
    const users: IUserDb[] = await retrieveResearchedUsers(userId, researchCriterias);

    const outputUsers: IUserOutput[] = users.map((user): IUserOutput => {
        return (sanitizeUserForOutput(user, false));
    });
    return outputUsers;
}