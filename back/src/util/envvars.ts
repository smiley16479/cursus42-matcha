import { InternalError } from "../types/error";

export function getEnv(key: string): string {
    const value = process.env[key];

    if (value === undefined) {
        throw new InternalError();
    }
    return value;
}