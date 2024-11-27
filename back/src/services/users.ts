import bcrypt from 'bcrypt';
import { passwordStrength } from 'check-password-strength';
import { Request, Response } from "express";
import fs from 'fs';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import * as crypto from "node:crypto";
import path from "node:path";
import nodemailer from 'nodemailer';
import { deleteEmailConfirmationToken, deleteNotification, deleteResetPasswordToken, deleteUser, deleteUserBlock, deleteUserInterests, deleteUserLike, deleteUserPictureById, deleteUserPictures, insertEmailConfirmToken, insertNotification, insertResetPasswordToken, insertUser, insertUserBlock, insertUserLike, insertUserPicture, insertUserReport, insertUserVisit, retrieveEmailConfirmationTokenFromToken, retrieveResetPasswordTokenFromToken, retrieveUserBlockFromUsers, retrieveUserFromEmail, retrieveUserFromId, retrieveUserFromUserName, retrieveUserLikeFromUsers, retrieveUserPicture, retrieveUserPictures, retrieveUserReportFromUsers, retrieveUserVisitFromUsers, updateNotificationRead, updateUser, updateUserInterests } from "../db/users";
import { EGender, ESexualPref, IUserCredentials, IUserInput, IUserOutput, IUserPictureInput, string2EGender, string2ESexualPref } from "../types/shared_type/user";
import { IEmailConfirmToken, IResetPasswordToken, IUserBlock, IUserDb, IUserInputInternal } from '../types/user';
import { Notif_t_E } from '../types/shared_type/notification';
import { AppError, InternalError, RessourceAlreadyExistsError, TokenExpiredError, TokenNotFoundError, UserNotFoundError } from '../types/error';
import { getEnv } from '../util/envvars';
import { ConnectedUsers } from './connectedUsers';


/*********************************************************
 * ================== USER MANAGEMENT ====================
 *********************************************************/

export async function createUser(inputUser: IUserInput) {

    await checkUserNameUniqueness(inputUser.userName);

    checkPasswordStrength(inputUser.password);

    const [hashedPassword, gender, sexualPref, biography, latitude, longitude, emailVerified] = await convertValues(inputUser);

    const user: IUserInputInternal = {
        email: inputUser.email,
        emailVerified: emailVerified,
        userName: inputUser.userName,
        firstName: inputUser.firstName,
        lastName: inputUser.lastName,
        password: hashedPassword,
        gender: gender,
        sexualPref: sexualPref,
        age: 0,
        biography: biography,
        fameRate: 0,
        latitude: latitude,
        longitude: longitude,
        lastConnection: new Date(),
        profileVisibility: true,
        emailNotifications: false,
        maxDistance: 50,
        matchAgeMin: 18,
        matchAgeMax: 30
    };

    let id: number | null;

    try {
        id = await insertUser(user);
    } catch (error) {
        throw error;
    }

    if (id) {
        await sendVerificationEmail(id);
    } else {
        throw new InternalError();
    }
}

export async function loginUser(credentials: IUserCredentials) {
    const user: IUserDb = await retrieveUserFromUserName(credentials.userName);

    if (!user)
        throw new UserNotFoundError();
    if (user.emailVerified == false && getEnv("DEBUG") != "true")
        throw new AppError(403, 'Email Not Verified');
    const result = await bcrypt.compare(credentials.password, user.password);
    if (result == false)
        throw new AppError(401, 'Wrong Password');

    credentials.password = "";

    const secret = getEnv("JWT_SECRET");
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: getEnv("JWT_EXP") });

    const outputUser: IUserOutput = prepareUserForOutput(user, true);

    patchUser(user.id, {lastConnection: new Date()});
    ConnectedUsers.instance.addConnectedUser(user.id);

    return [token, outputUser];
}

export async function logoutUser(userId: number) {
    ConnectedUsers.instance.removeConnectedUser(userId);
}

export async function getUser(id: number, isSelf: boolean): Promise<IUserOutput | null> {
    const user: IUserDb = await retrieveUserFromId(id);
    if (!user || !user.id) {
        throw new UserNotFoundError();
    }

    const outputUser: IUserOutput = prepareUserForOutput(user, isSelf);

    return outputUser;
}

export async function removeUser(id: number) {
    try {
        deleteUser(id);
        deleteUserInterests(id);
        removeUserPictures(id);
    } catch (error) {
        throw error;
    }
}

export async function patchUser(id: number, rawUser: any) {

    if (getEnv("DEBUG") != "true") {
        for (const key of Object.keys(rawUser)) {
            switch (key.toLowerCase()) {
                case "id":
                    delete rawUser[key];
                    break;
                case "emailverified":
                    delete rawUser[key];
                    break;
                case "password":
                    delete rawUser[key];
                    break;
                case "famerate":
                    delete rawUser[key];
                    break;
                case "lastconnection":
                    delete rawUser[key];
                    break;
                case "createdat":
                    delete rawUser[key];
                    break;
                case "username":
                    delete rawUser[key];
                    break;
            }
        }
    }

    try {
        let isEmailUpdated: boolean = false;

        if ('email' in rawUser) {
            const oldUser = await retrieveUserFromId(id);

            if (oldUser.email !== rawUser.email) {
                isEmailUpdated = true;
                rawUser.emailVerified = false;
            }
        }

        if ('interests' in rawUser) {
            await updateUserInterests(id, rawUser.interests);
            delete rawUser.interests;
        }
        if (Object.keys(rawUser).length != 0)
            await updateUser(id, rawUser);

        if (isEmailUpdated)
            sendVerificationEmail(id);

    } catch (error) {
        throw error;
    }
}

export function prepareUserForOutput(user: IUserDb, isSelf: boolean): IUserOutput {
    const outputUser: IUserOutput = user;

    if (!isSelf) {
        delete outputUser['email'];
        delete outputUser['emailVerified'];
        delete outputUser['profileVisibility'];
        delete outputUser['emailNotifications'];
        delete outputUser['maxDistance'];
        delete outputUser['matchAgeMin'];
        delete outputUser['matchAgeMax'];
        delete outputUser['visits'];
        delete outputUser['likes'];
        delete outputUser['notifications'];
    }
    delete outputUser['password'];
    delete outputUser['createdAt'];

    user.isConnected = ConnectedUsers.instance.isUserConnected(user.id);

    return outputUser;
}

// Helpers

function checkPasswordStrength(password: string) {
    const strength = passwordStrength(password);

    if (strength.id < 2)
        throw new AppError(400, 'Password Not Strong enough');
}

async function checkUserNameUniqueness(userName: string) {
    const userWithSameUserName = await retrieveUserFromUserName(userName);
    if (userWithSameUserName)
        throw new AppError(409, 'Username Already Taken');
}

async function convertValues(rawUser: any): Promise<[string, EGender, ESexualPref, string, number, number, boolean]> {
    const hashedPassword: string = await bcrypt.hash(rawUser.password, 10);
    let gender: EGender;
    let sexualPref: ESexualPref;
    let biography: string;
    let latitude: number;
    let longitude: number;
    let emailVerified: boolean;

    if ('latitude' in rawUser) {
        latitude = parseFloat(rawUser.latitude);
        longitude = parseFloat(rawUser.longitude);
    } else {
        latitude = 0;
        longitude = 0;
    }

    if ('gender' in rawUser)
        gender = string2EGender(rawUser.gender);
    else
        gender = EGender.Unknown;

    if ('sexualPref' in rawUser)
        sexualPref = string2ESexualPref(rawUser.sexualPref);
    else
        sexualPref = ESexualPref.Both;

    if ('biography' in rawUser)
        biography = rawUser.biography;
    else
        biography = "";

    if (getEnv("DEBUG") == "true")
        emailVerified = true;
    else
        emailVerified = false;

    return [hashedPassword, gender, sexualPref, biography, latitude, longitude, emailVerified];
}

/*********************************************************
 * =========== EMAIL VERIFICATION MANAGEMENT =============
 *********************************************************/

export async function verifyEmail(token: string) {
    const emailConfirmToken: IEmailConfirmToken = await retrieveEmailConfirmationTokenFromToken(token);
    if (!emailConfirmToken || !emailConfirmToken.confirmToken) {
        throw new TokenNotFoundError();
    }

    let hours = moment().diff(moment(emailConfirmToken.createdAt), 'hours');
    if (hours >= 24) {
        deleteEmailConfirmationToken(emailConfirmToken.id);
        throw new TokenExpiredError();
    }

    updateUser(emailConfirmToken.user, { emailVerified: true });
    deleteEmailConfirmationToken(emailConfirmToken.id);
}

// Helpers

async function sendVerificationEmail(id: number) {

    const user: IUserDb = await retrieveUserFromId(id);
    const confirmToken: string = crypto.randomBytes(20).toString('hex');
    await insertEmailConfirmToken(id, confirmToken);

    const transporter = nodemailer.createTransport({
        host: getEnv("MAILER_HOST"),
        port: getEnv("MAILER_PORT"),
        secure: true,
        auth: {
            user: getEnv("MAILER_LOGIN"),
            pass: getEnv("MAILER_PASSWORD"),
        },
    });

    const info = await transporter.sendMail({
        from: '"Matcha!" <matcha@42l.fr>',
        to: user.email,
        subject: "Confirm your email!",
        text: "Confirm your email by using this link : http://localhost:3000/api/user/confirmemail/" + confirmToken,
        html: "<b>To confirm your email, click this <u><a href='http://localhost:3000/api/user/confirmemail/" + confirmToken + "'>link<a></u></b>",
    });

    console.log("Message sent: %s", info.messageId);
}

/*********************************************************
 * ============== PASSWORD RESET MANAGEMENT ==============
 *********************************************************/

export async function sendResetPasswordEmail(email: string) {
    const user: IUserDb = await retrieveUserFromEmail(email);
    if (!user)
        throw new UserNotFoundError();

    const resetPasswordToken: string = crypto.randomBytes(20).toString('hex');

    await insertResetPasswordToken(user.id, resetPasswordToken);

    const transporter = nodemailer.createTransport({
        host: getEnv("MAILER_HOST"),
        port: getEnv("MAILER_PORT"),
        secure: true,
        auth: {
            user: getEnv("MAILER_LOGIN"),
            pass: getEnv("MAILER_PASSWORD"),
        },
    });

    const info = await transporter.sendMail({
        from: '"Matcha!" <matcha@42l.fr>',
        to: user.email,
        subject: "Reset your password!",
        text: "Reset your password by using this link : http://localhost:3000/api/user/resetpassword/" + resetPasswordToken,
        html: "<b>To reset your password, click this <u><a href='http://localhost:3000/api/user/resetpassword/" + resetPasswordToken + "'>link<a></u></b>",
    });

    console.log("Message sent: %s", info.messageId);
}

export async function resetPassword(token: string, rawUser: any) {
    const resetPasswordToken: IResetPasswordToken = await retrieveResetPasswordTokenFromToken(token);
    if (!resetPasswordToken || !resetPasswordToken.resetToken) {
        throw new TokenNotFoundError();
    }

    let hours = moment().diff(moment(resetPasswordToken.createdAt), 'hours');
    if (hours >= 24) {
        deleteResetPasswordToken(resetPasswordToken.id);
        throw new TokenExpiredError();
    }

    checkPasswordStrength(rawUser.password);

    const hashedPassword: string = await bcrypt.hash(rawUser.password, 10);

    updateUser(resetPasswordToken.user, { password: hashedPassword });
    deleteResetPasswordToken(resetPasswordToken.id);
}

/*********************************************************
 * ================ PICTURE MANAGEMENT ===================
 *********************************************************/

export async function manageUploadedPicture(req: Request, res: Response) {
    const userId = res.locals.user.id;
    const pictureIndex = parseInt(req.body.index);

    if (pictureIndex < 1 || pictureIndex > 5)
        throw new AppError(400, 'Picture Index Out Of Range');

    const oldPicture = await retrieveUserPicture(userId, req.body.index);
    if (oldPicture) {
        fs.unlink(path.join(getEnv("UPLOAD_DIR"), oldPicture.filename), () => { });
        deleteUserPictureById(oldPicture.id);
    }

    const userPicture: IUserPictureInput = {
        user: userId,
        filename: req.file.filename,
        pictureIndex: pictureIndex
    };

    await insertUserPicture(userPicture);
}

export async function removeUserPicture(userId: number, pictureIndex: number) {
    const userPicture = await retrieveUserPicture(userId, pictureIndex);
    fs.unlink(path.join(getEnv("UPLOAD_DIR"), userPicture.filename), () => { });
    await deleteUserPictureById(userPicture.id);
}

// Helpers

async function removeUserPictures(userId: number) {
    const userPictures = await retrieveUserPictures(userId);

    userPictures.forEach((userPicture) => {
        fs.unlink(path.join(getEnv("UPLOAD_DIR"), userPicture.filename), () => { });
    });
    deleteUserPictures(userId);
}

/*********************************************************
 * ================ VISITS MANAGEMENT ====================
 *********************************************************/

export async function addNewUserVisit(visitedUserId: number, visiterUserId: number) {
    const existingUserVisit = await retrieveUserVisitFromUsers(visitedUserId, visiterUserId);

    if (existingUserVisit)
        throw new RessourceAlreadyExistsError();

    insertUserVisit(visitedUserId, visiterUserId);
}

/*********************************************************
 * ================ LIKES MANAGEMENT =====================
 *********************************************************/

export async function addNewUserLike(likedUserId: number, likerUserId: number) {
    const existingUserLike = await retrieveUserLikeFromUsers(likedUserId, likerUserId);

    if (existingUserLike)
        throw new RessourceAlreadyExistsError();

    const liker: IUserDb = await retrieveUserFromId(likerUserId);
    if (liker.pictures.length == 0)
        throw new AppError(403, 'No Picture No Like');

    insertUserLike(likedUserId, likerUserId);
}

export async function removeUserLike(likedUserId: number, likerUserId: number) {
    deleteUserLike(likedUserId, likerUserId);
}

/**********************************************************
 * ================ BLOCKS MANAGEMENT =====================
 *********************************************************/

export async function addNewBlock(blockedUserId: number, blockerUserId: number) {
    const existingUserBlock = await retrieveUserBlockFromUsers(blockedUserId, blockerUserId);

    if (existingUserBlock)
        throw new RessourceAlreadyExistsError();

    insertUserBlock(blockedUserId, blockerUserId);
}

export async function getUserBlock(blockedUserId: number, blockerUserId: number) {
    const userBlock: IUserBlock = await retrieveUserBlockFromUsers(blockedUserId, blockerUserId);
    if (!userBlock || !userBlock.id) {
        return null;
    }

    return userBlock;
}

export async function removeUserBlock(blockedUserId: number, blockerUserId: number) {
    deleteUserBlock(blockedUserId, blockerUserId);
}

/**********************************************************
 * ================ REPORTS MANAGEMENT ====================
 *********************************************************/

export async function addNewReport(reportedUserId: number, reporterUserId: number) {
    const existingUserReport = await retrieveUserReportFromUsers(reportedUserId, reporterUserId);

    if (existingUserReport)
        throw new RessourceAlreadyExistsError();

    insertUserReport(reportedUserId, reporterUserId);
}

/*********************************************************
 * ============ NOTIFICATIONS MANAGEMENT =================
 *********************************************************/

export async function addNewNotification(userId: number, involvedUserId: number, type: Notif_t_E) {
    const block = await getUserBlock(involvedUserId, userId);
    if (!block)
        insertNotification(userId, involvedUserId, type, false);
}

export async function markNotificationRead(notifId: number) {
    updateNotificationRead(notifId);
}

export async function removeNotification(notifId: number) {
    deleteNotification(notifId);
}