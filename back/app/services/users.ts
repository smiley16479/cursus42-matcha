import { deleteEmailConfirmationToken, deleteResetPasswordToken, deleteUser, deleteUserInterests, insertEmailConfirmToken, insertResetPasswordToken, insertUser, retrieveEmailConfirmationTokenFromToken, retrieveResetPasswordTokenFromToken, retrieveUserFromEmail, retrieveUserFromId, retrieveUserFromUsername, updateUser, updateUserInterests } from "../db/users";
import { EGender, IEmailConfirmToken, IResetPasswordToken, IUserDb, IUserInput, IUserOutput, ESexualPref, string2EGender, string2ESexualPref } from "../types/user";
import bcrypt from 'bcrypt';
import { passwordStrength } from 'check-password-strength'
import nodemailer from 'nodemailer';
import * as crypto from "node:crypto";
import moment from 'moment';
import jwt from 'jsonwebtoken';


/*********************************************************
 * ================== USER MANAGEMENT ====================
 *********************************************************/

export async function createUser(rawUser: any) {

    checkPasswordStrength(rawUser.password);

    const [hashedPassword, gender, sexualPref, biography, latitude, longitude] = await convertValues(rawUser);

    const user: IUserInput = {
        email: rawUser.email,
        emailVerified: false,
        username: rawUser.username,
        firstName: rawUser.firstName,
        lastName: rawUser.lastName,
        password: hashedPassword,
        gender: gender,
        sexualPref: sexualPref,
        biography: biography,
        fameRate: 0,
        latitude: latitude,
        longitude: longitude,
        lastConnection: new Date(),
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
        throw new Error();
    }
}

export async function loginUser(credentials: any) {
    const user = await retrieveUserFromUsername(credentials.username);

    if (user.emailVerified == false)
        throw new Error();
    const result = await bcrypt.compare(credentials.password, user.password);
    if (result == false)
        throw new Error();

    delete credentials.password;

    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new Error();
    const token = jwt.sign({id: user.id}, secret, { expiresIn: process.env.JWT_EXP });

    return token;
}

export async function getUser(id: number): Promise<IUserOutput | null> {
    const user: IUserOutput = await retrieveUserFromId(id);
    if (!user) {
        return null;
    }

    delete user['email'];
    delete user['emailVerified'];
    delete user['password'];
    delete user['createdAt'];

    return user;
}

export async function removeUser(id: number) {
    try {
        await deleteUser(id);
        await deleteUserInterests(id);
    } catch (error) {
        throw error;
    }
}

export async function patchUser(id: number, rawUser: any) {
    try {
        await updateUser(id, rawUser);
        if ('interests' in rawUser) {
            await updateUserInterests(id, rawUser.interests);
        }
    } catch (error) {
        throw error;
    }
}

// Helpers

function checkPasswordStrength(password: string) {
    const strength = passwordStrength(password);

    if (strength.id < 2)
        throw new Error();
}

async function convertValues(rawUser: any): Promise<[string, EGender, ESexualPref, string, number, number]> {
    const hashedPassword: string = await bcrypt.hash(rawUser.password, 10);
    let gender: EGender;
    let sexualPref: ESexualPref;
    let biography: string;
    let latitude: number;
    let longitude: number;

    if ('latitude' in rawUser) {
        latitude = parseFloat(rawUser.latitude);
        longitude = parseFloat(rawUser.longitude);
    } else {  // TODO: compute from IP ?
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

    return [hashedPassword, gender, sexualPref, biography, latitude, longitude];
}

/*********************************************************
 * =========== EMAIL VERIFICATION MANAGEMENT =============
 *********************************************************/

export async function verifyEmail(token: string) {
    const emailConfirmToken: IEmailConfirmToken = await retrieveEmailConfirmationTokenFromToken(token);
    if (!emailConfirmToken || !emailConfirmToken.confirmToken) {
        throw new Error();
    }

    let hours = moment().diff(moment(emailConfirmToken.createdAt), 'hours');
    if (hours >= 24) {
        throw new Error();
    }

    updateUser(emailConfirmToken.user, {emailVerified: true});
    deleteEmailConfirmationToken(emailConfirmToken.id);
}

// Helpers

async function sendVerificationEmail(id: number) {

    const user: IUserDb = await retrieveUserFromId(id);
    const confirmToken: string = crypto.randomBytes(20).toString('hex');
    await insertEmailConfirmToken(id, confirmToken);

    const transporter = nodemailer.createTransport({
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        secure: true,
        auth: {
            user: process.env.MAILER_LOGIN,
            pass: process.env.MAILER_PASSWORD,
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
        throw new Error();

    const resetPasswordToken: string = crypto.randomBytes(20).toString('hex');

    await insertResetPasswordToken(user.id, resetPasswordToken);

    const transporter = nodemailer.createTransport({
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        secure: true,
        auth: {
            user: process.env.MAILER_LOGIN,
            pass: process.env.MAILER_PASSWORD,
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
    checkPasswordStrength(rawUser.password);

    const resetPasswordToken: IResetPasswordToken = await retrieveResetPasswordTokenFromToken(token);
    if (!resetPasswordToken || !resetPasswordToken.resetToken) {
        throw new Error();
    }

    let hours = moment().diff(moment(resetPasswordToken.createdAt), 'hours');
    if (hours >= 24) {
        throw new Error();
    }

    const hashedPassword: string = await bcrypt.hash(rawUser.password, 10);

    updateUser(resetPasswordToken.user, {password: hashedPassword});
    deleteResetPasswordToken(resetPasswordToken.id);
}