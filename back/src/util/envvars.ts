export function getEnv(key: string): string {
    const value = process.env[key];

    if (value === undefined) {
        console.log("No .env file found. Please restart the server with one");
        while(1);
    }
    return value;
}