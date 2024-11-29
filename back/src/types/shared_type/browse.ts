import { EInterest, ESexualPref } from "./user";

export enum ESortOn {
    FameRate = "fameRate",
    Distance = "distance",
    Age = "age",
    Interests = "interests",
    Score = "score"
}

export enum ESortingType {
    Ascending = "asc",
    Descending = "desc"
}

export interface IBrowseCriterias {
    sexualPref: ESexualPref,
    matchAgeMin: number,
    matchAgeMax: number,
    minFameRate: number,
    maxFameRate: number,
    latitude: number,
    longitude: number,
    maxDistance: number,
    interests: EInterest[],
    nbRequiredProfiles: number,
    offset: number,
    sortingOn: ESortOn,
    sortingType: ESortingType
}