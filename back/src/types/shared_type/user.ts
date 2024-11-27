// Enums

export enum EGender {
    Female = "Female",
    Male = "Male",
    Unknown = "Unknown"
}

export enum ESexualPref {
    Female = "Female",
    Male = "Male",
    Both = "Both"
}

export enum EGeoPref {
    Never = "Never",
    Always = "Always",
    Match = "Match"
}

export enum EInterest {
    Books = "Books",
    Blogging = "Blogging",
    Dancing = "Dancing",
    Singing = "Singing",
    Music = "Music",
    Languages = "Languages",
    Shopping = "Shopping",
    Traveling = "Traveling",
    Hiking = "Hiking",
    Cycling = "Cycling",
    Exercising = "Exercising",
    Drawing = "Drawing",
    Painting = "Painting",
    Collection = "Collection",
    VideoGames = "VideoGames",
    Cooking = "Cooking",
    Baking = "Baking",
    Gardening = "Gardening",
    Embroidering = "Embroidering",
    Sewing = "Sewing",
    Knitting = "Knitting",
    BoardGames = "BoardGames",
    Walking = "Walking",
    Writing = "Writing",
    Fishing = "Fishing",
    Photography = "Photography",
    Skydiving = "Skydiving",
    Skating = "Skating",
    Skiing = "Skiing",
    Longboarding = "Longboarding",
    Surfing = "Surfing"
}

// Interfaces

export interface IMinimalUser {
    userName: string,
    firstName: string,
    lastName: string,
}

export interface IUserInput extends IMinimalUser {
    email: string,
    password: string
}

export interface IUserOutput extends IMinimalUser {
    id: number,
    age: number,
    gender: EGender,
    sexualPref: ESexualPref,
    biography: string,
    fameRate: number,
    latitude: number,
    longitude: number,
    lastConnection: Date,
    interests: string[]
    // TODO: Add pictures
    // TODO: Add visits
}

export interface IUserSelf extends IUserOutput {
    email: string,
    emailVerified: boolean,
    profileVisibility: boolean,
    emailNotifications: boolean,
    maxDistance: number,
    matchAgeMin: number,
    matchAgeMax: number
}

export interface IUserCredentials {
    userName: string,
    password: string
}

export type UserPic_t = {
    filename: string,
    pictureIndex: number
}

export interface IUserPictureInput {
    userId: number,
    filename: string,
    pictureIndex: number,
}

// Helpers

export function string2EInterest(interestString: string): EInterest {
    const interest = Object.values(EInterest).find(entry => entry === interestString);
    if (!interest)
        throw new TypeError;
    return interest;
}

export function string2EGender(genderString: string): EGender {
    switch (genderString) {
        case "Female":
            return EGender.Female;
        case "Male":
            return EGender.Male;
        case "Unknown":
            return EGender.Unknown;
        default:
            throw new TypeError;
    } 
}

export function string2ESexualPref(sexualPrefString: string): ESexualPref {
    switch (sexualPrefString) {
        case "Female":
            return ESexualPref.Female;
        case "Male":
            return ESexualPref.Male;
        case "Both":
            return ESexualPref.Both;
        default:
            throw new TypeError;
    } 
}