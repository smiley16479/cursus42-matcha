import { EGender, EInterest } from "./user";

export interface IResearchCriterias {
    requiredGender: EGender,
    minAge: number,
    maxAge: number,
    minFameRate: number,
    maxFameRate: number,
    locationLatitude: number,
    locationLongitude: number,
    maxDistance: number,
    interests: EInterest[]
}