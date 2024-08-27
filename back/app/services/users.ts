import { insertUser } from "../db/users";
import bcrypt from 'bcrypt';
import { User, string2Gender, string2SexualPref } from "../types/user";

export async function createUser(rawUser: any) {
    const hashedPassword: string = await bcrypt.hash(rawUser.password, 10);

    const user: User = {
        email: rawUser.email,
        firstName: rawUser.firstName,
        lastName: rawUser.lastName,
        password: hashedPassword,
        gender: string2Gender(rawUser.gender),
        sexualPref: string2SexualPref(rawUser.sexualPref),
        biography: rawUser.biography,
        fameRate: 0,
        latitude: parseFloat(rawUser.latitude),
        longitude: parseFloat(rawUser.longitude),
        lastConnection: new Date()
    };

    insertUser(user);
}