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
    }
}

export async function updateUserFameRate(userId: number) {
    const visitsWeight = 1;
    const likesWeight = 2;
    const blocksWeight = -1;

    const user = await retrieveUserFromId(userId);

    const visitsScore = getVisitsScore(user);
    const likesScore = getLikesScore(user);
    const blocksScore = getBlocksScore(user);

    const meanFameRate = (visitsScore * visitsWeight + likesScore * likesWeight + blocksScore * blocksWeight) / (likesWeight + visitsWeight);
    const fameRate = Math.max(meanFameRate, 0) * 100;

    updateUser(user.id, { "fameRate": fameRate });
}

// Helpers

function getVisitsScore(user: IUserDb) {
    const estimatedMaxVisits = 10000
    const visits = user.visits;
    let visitsScore = .0;

    // nb of visits weighted by age of the visit
    for (var visit of visits) {
        let daysSinceVisit = moment().diff(moment(visit.date), 'days');

        visitsScore += Math.exp(-0.5 * daysSinceVisit + 2); // e^(-0.5t + 2)
    }

    // Normalization
    //
    //   log(1 + v)
    // -------------
    // log(1 + vMax)

    visitsScore = Math.log(1 + visitsScore) / Math.log(1 + estimatedMaxVisits);
    return visitsScore;
}

function getLikesScore(user: IUserDb) {
    const estimatedMaxLikes = 10000;
    const likes = user.likedBy;
    let likesScore = .0;

    // nb of likes weighted by age of the like
    for (var like of likes) {
        let daysSinceLike = moment().diff(moment(like.date), 'days');

        likesScore += Math.exp(-0.5 * daysSinceLike + 2); // e^(-0.5t + 2)
    }

    // Normalization
    //
    //   log(1 + l)
    // -------------
    // log(1 + lMax)

    likesScore = likesScore = Math.log(1 + likesScore) / Math.log(1 + estimatedMaxLikes);
    return likesScore;
}

function getBlocksScore(user: IUserDb) {
    const blocks = user.blockedBy;
    const blocksNb = blocks.length;

    const blocksScore = 10 * Math.exp(blocksNb - 5); // 10 * e^(n - 5)

    return blocksScore;
}