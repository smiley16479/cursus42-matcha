export class ConnectedUsers {
    static #instance: ConnectedUsers;
    #connectedUsers: number[];

    private constructor() {
        this.#connectedUsers = [];
    }
    
    public static get instance(): ConnectedUsers {
        if (!ConnectedUsers.#instance)
            ConnectedUsers.#instance = new ConnectedUsers();
        return ConnectedUsers.#instance;
    }

    public addConnectedUser(userId: number) {
        if (!this.isUserConnected(userId))
            this.#connectedUsers.push(userId);
    }

    public removeConnectedUser(userId: number) {
        const indexToRemove = this.#connectedUsers.indexOf(userId);
        if (indexToRemove != -1)
            delete this.#connectedUsers[indexToRemove];
    }

    public isUserConnected(userId: number) {
        if (this.#connectedUsers.includes(userId))
            return true;
        else
            return false;
    }
}