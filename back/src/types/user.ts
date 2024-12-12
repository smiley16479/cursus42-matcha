import { RowDataPacket } from "mysql2";
import { EGender, ESexualPref, IUserInput, IUserPictureInput, IUserSelf } from './shared_type/user';
import { Notif_t_E } from "./shared_type/notification";

export interface IUserDb extends RowDataPacket, IUserInput, IUserSelf {
    createdAt: Date
}

export interface IUserInputInternal extends IUserInput {
    emailVerified: boolean,
    gender: EGender,
    sexualPref: ESexualPref,
    age: number,
    biography: string,
    fameRate: number,
    latitude: number,
    longitude: number,
    lastConnection: Date,
    profileVisibility: boolean,
    emailNotifications: boolean,
    maxDistance: number,
    matchAgeMin: number,
    matchAgeMax: number
}

export interface IEmailConfirmToken extends RowDataPacket {
    id: number,
    userId: number,
    confirmToken: string,
    createdAt: Date
}

export interface IResetPasswordToken extends RowDataPacket {
    id: number,
    userId: number,
    resetToken: string,
    createdAt: Date
}

export interface IUserInterest extends RowDataPacket {
    id: number,
    interest: string,
    createdAt: Date
}

export interface IUserPicture extends RowDataPacket, IUserPictureInput {
    id: number,
    createdAt: Date
}

export interface IUserVisitDb extends RowDataPacket {
    id: number,
    visited: number,
    visiter: number,
    createdAt: Date
}

export interface IUserLikeDb extends RowDataPacket {
    id: number,
    likedUserId: number,
    likerUserId: number,
    createdAt: Date
}

export interface IUserBlock extends RowDataPacket {
    id: number,
    blocked: number,
    blocker: number,
    createdAt: Date
}

export interface IUserReport extends RowDataPacket {
    id: number,
    reported: number,
    reporter: number,
    createdAt: Date
}

export interface IUserNotifDb extends RowDataPacket {
    id: number,
    userId: number,
    involvedUserId: number,
    type: Notif_t_E,
    payloadId: number,
    createdAt: Date
}