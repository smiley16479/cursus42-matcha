import type { IUserOutput } from "./user";

export type matchEventInput_t = {
    guestId: number;
    title: string;
    date: Date;
    location: string;
    description: string;
}

export type MatchEventOutput_t = {
    id: number
    users: [IUserOutput, IUserOutput];
    title: string;
    date: Date;
    location: string;
    description: string;
};
