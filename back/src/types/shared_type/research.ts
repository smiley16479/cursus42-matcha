import { EGender, EInterest } from "./user";

export enum ESortOn {
    FameRate = "fameRate",
    Distance = "distance",
    Age = "age",
    Interests = "interests"
}

export enum ESortingType {
    Ascending = "asc",
    Descending = "desc"
}

export interface IResearchCriterias {
    requiredGender: EGender,
    minAge: number,
    maxAge: number,
    minFameRate: number,
    maxFameRate: number,
    locationLatitude: number,
    locationLongitude: number,
    maxDistance: number,
    interests: EInterest[],
    nbRequiredProfiles: number,
    offset: number,
    sortingOn: ESortOn,
    sortingType: ESortingType
}