import { retrieveMatchingUsers } from "../db/match";
import { retrieveUserFromId } from "../db/users";
import { IUserOutput } from "../types/shared_type/user";
import { IUserDb } from "../types/user";
import { sanitizeUserForOutput } from "./users";

export async function getMatchCandidates(userId: number): Promise<IUserOutput[]> {
    const user: IUserDb = await retrieveUserFromId(userId);

    const users: IUserDb[] = await retrieveMatchingUsers(user);
    const outputUsers: IUserOutput[] = users.map((user): IUserOutput => {
        return (sanitizeUserForOutput(user, false));
    });
    return (outputUsers);
}