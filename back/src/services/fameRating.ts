import moment from "moment";
import { retrieveAllUsers, retrieveUserFromId, updateUser } from "../db/users";
import { IUserDb } from "../types/user";

export async function startUpdateAllUsersFameRateTask() {
    UpdateAllUsersFameRate();
    setInterval(UpdateAllUsersFameRate, 10000); // 10 secondes
}

export async function UpdateAllUsersFameRate() {
    try {
        const users = await retrieveAllUsers();
        users.forEach((user) => {
            updateUserFameRate(user.id);
        })
    } catch (error) {
        console.log('catched error :');
        console.log(error);
    }
}

export async function updateUserFameRate(userId: number) {
    const user = await retrieveUserFromId(userId);

    const visitsScore = getVisitsScore(user);
    const likeSscore = getLikesScore(user);
    const blocksScore = getBlocksScore(user);

    const fameRate = Math.max(visitsScore + likeSscore + blocksScore * -1, 0);
    updateUser(user.id, { "fameRate": fameRate });
}

// Helpers

function getVisitsScore(user: IUserDb) {
    const visits = user.visits;
    let visitsScore = .0;

    for (var visit of visits) {
        let daysSinceVisit = moment().diff(moment(visit.date), 'days');

        visitsScore += Math.exp(-0.5 * daysSinceVisit + 2); // e^(-0.5t + 2)
    }
    return visitsScore;
}

function getLikesScore(user: IUserDb) {
    const likes = user.likedBy;
    let likesScore = .0;

    for (var like of likes) {
        let daysSinceLike = moment().diff(moment(like.date), 'days');

        likesScore += Math.exp(-0.5 * daysSinceLike + 2); // e^(-0.5t + 2)
    }
    return likesScore;
}

function getBlocksScore(user: IUserDb) {
    const blocks = user.blockedBy;
    const blocksNb = blocks.length;

    const blocksScore = 120 * Math.exp(2 * blocksNb - 9); // 120 * e^(2n - 9)

    return blocksScore;
}