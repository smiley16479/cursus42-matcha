import { RowDataPacket } from "mysql2";
import { EGender, ESexualPref, IUserInput, IUserPictureInput, IUserSelf } from './shared_type/user';

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

export interface IUserInterest extends RowDataPacket {
  id: number,
  interest: string,
  createdAt: Date
}

export interface IUserPicture extends RowDataPacket, IUserPictureInput {
  id: number,
  createdAt: Date
}

export interface IUserVisit extends RowDataPacket {
  id: number,
  visited: number,
  visiter: number,
  createdAt: Date
}

export interface IUserLike extends RowDataPacket {
  id: number,
  liked: number,
  liker: number,
  createdAt: Date
}