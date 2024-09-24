import { RowDataPacket } from "mysql2";

// Enums

export enum Gender {
    Female = "Female",
    Male = "Male"
}

export enum SexualPref {
    Female = "Female",
    Male = "Male",
    Both = "Both"
}

// Interfaces

export interface IMinimalUser {
    username: string,
    firstName: string,
    lastName: string,
    gender: Gender,
    sexualPref: SexualPref,
    biography: string,
    fameRate: number,
    latitude: number,
    longitude: number,
    lastConnection: Date
}

export interface IUserInput extends IMinimalUser {
    email: string,
    emailVerified: boolean,
    password: string
}

export interface IUserOutput extends IMinimalUser {
    id: number,
}

export interface IUserDb extends RowDataPacket, IUserInput, IUserOutput {
    createdAt: Date
}

export interface IEmailConfirmToken extends RowDataPacket {
    id: number,
    user: number,
    confirmToken: string,
    createdAt: Date
}

export interface IResetPasswordToken extends RowDataPacket {
    id: number,
    user: number,
    resetToken: string,
    createdAt: Date
}

export interface IInterest extends RowDataPacket {
    id: number,
    name: string,
    createdAt: Date
}

// Helpers

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