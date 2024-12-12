import { retrieveMatchingUsers } from "../db/browse";
import { retrieveUserFromId } from "../db/users";
import { IBrowseCriterias } from "../types/shared_type/browse";
import { IUserOutput } from "../types/shared_type/user";
import { IUserDb } from "../types/user";
import { prepareUserForOutput } from "./users";

export async function getMatchCandidates(userId: number, browseCriterias: IBrowseCriterias): Promise<IUserOutput[]> {
    const user: IUserDb = await retrieveUserFromId(userId);

    const users: IUserDb[] = await retrieveMatchingUsers(user, browseCriterias);

    const outputUsers: IUserOutput[] = await Promise.all(
        users.map(async (user): Promise<IUserOutput> => {
            return await prepareUserForOutput(user, false);
        })
    );
    return outputUsers;
}