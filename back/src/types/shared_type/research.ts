import { EInterest } from "./user";

export interface IResearchCriterias {
    minAge: number,
    maxAge: number,
    minFameRate: number,
    maxFameRate: number,
    locationLatitude: number,
    locationLongitude: number,
    maxDistance: number,
    interest: EInterest[]
}