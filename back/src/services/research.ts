import { retrieveResearchedUsers } from "../db/research";
import { retrieveUserFromId } from "../db/users";
import { IResearchCriterias } from "../types/shared_type/research";
import { IUserOutput } from "../types/shared_type/user";
import { IUserDb } from "../types/user";
import { prepareUserForOutput } from "./users";

export async function getResearchResults(userId: number, researchCriterias: IResearchCriterias): Promise<IUserOutput[]> {
    const user: IUserDb = await retrieveUserFromId(userId);

    const users: IUserDb[] = await retrieveResearchedUsers(user, researchCriterias);

    const outputUsers: IUserOutput[] = users.map((user): IUserOutput => {
        return (prepareUserForOutput(user, false));
    });
    return outputUsers;
}