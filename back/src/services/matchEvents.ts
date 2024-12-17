import { deleteMatchEvent, insertMatchEvent, retrieveMatchEvent } from "../db/matchEvents";
import { retrieveUserFromId } from "../db/users";
import { IUserMatchEventDb } from "../types/matchEvents";
import { matchEventInput_t, MatchEventOutput_t } from "../types/shared_type/matchEvents";
import { prepareUserForOutput } from "./users";

export async function createMatchEvent(userId: number, matchEvent: matchEventInput_t) {
    const matchEventId = await insertMatchEvent(userId, matchEvent);

    return await getMatchEvent(matchEventId);
}

export async function getMatchEvent(matchEventId: number) {
    const matchEventDb = await retrieveMatchEvent(matchEventId);

    return matchEventDb;
}

export async function removeMatchEvent(matchEventId: number) {
    await deleteMatchEvent(matchEventId);
}

export async function prepareMatchEventForOutput(matchEventDb: IUserMatchEventDb) {
    if (!matchEventDb)
        return matchEventDb;

    const user1 = await prepareUserForOutput(await retrieveUserFromId(matchEventDb.user1Id), false);
    const user2 = await prepareUserForOutput(await retrieveUserFromId(matchEventDb.user2Id), false);

    const outputMatchEvent: MatchEventOutput_t = {
        id: matchEventDb.id,
        users: [user1, user2],
        title: matchEventDb.title,
        date: matchEventDb.eventDate,
        location: matchEventDb.eventLocation,
        description: matchEventDb.description
    }

    return outputMatchEvent;
}