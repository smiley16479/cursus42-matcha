import { RowDataPacket } from "mysql2";

export enum Gender {
    Female = "Female",
    Male = "Male"
}

export enum SexualPref {
    Female = "Female",
    Male = "Male",
    Both = "Both"
}

export interface IUser {
    id?: number,
    email?: string,
    firstName: string,
    lastName: string,
    password?: string,
    gender: Gender,
    sexualPref: SexualPref,
    biography: string,
    fameRate: number,
    latitude?: number,
    longitude?: number,
    lastConnection: Date,
    created_at?: Date

}

export interface IDbUser extends RowDataPacket {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    gender: Gender,
    sexualPref: SexualPref,
    biography: string,
    fameRate: number,
    latitude: number,
    longitude: number,
    lastConnection: Date,
    created_at: Date
}

export function string2Gender(genderString: string): Gender {
    switch (genderString) {
        case "Female":
            return Gender.Female;
        case "Male":
            return Gender.Male;
        default:
            throw new TypeError;
    } 
}

export function string2SexualPref(sexualPrefString: string): SexualPref {
    switch (sexualPrefString) {
        case "Female":
            return SexualPref.Female;
        case "Male":
            return SexualPref.Male;
        case "Both":
            return SexualPref.Both;
        default:
            throw new TypeError;
    } 
}