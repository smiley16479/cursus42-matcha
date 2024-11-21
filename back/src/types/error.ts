export class AppError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export class InternalError extends AppError {
    constructor() {
        super(500, 'Internal Server Error');
    }
}

export class PermissionError extends AppError {
    constructor() {
        super(403, 'Permission Denied');
    }
}

export class UserNotFoundError extends AppError {
    constructor() {
        super(404, 'User Not Found');
    }
}

export class RessourceAlreadyExistsError extends AppError {
    constructor() {
        super(409, 'Ressource Already exists');
    }
}