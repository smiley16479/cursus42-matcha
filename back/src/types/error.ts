export class AppError extends Error {
    status: number;
    error?: any;

    constructor(status: number, message: string, error?: any) {
        super(message);
        this.status = status;
        if (error)
            this.error = error;
        else
            this.error = null
    }
}

export class InternalError extends AppError {
    constructor() {
        super(500, 'Internal Server Error');
    }
}

export class RouteNotFoundError extends AppError {
    constructor() {
        super(404, 'Route Not Found');
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

export class TokenNotFoundError extends AppError {
    constructor() {
        super(404, 'Token Not Found');
    }
}

export class TokenExpiredError extends AppError {
    constructor() {
        super(418, 'Token Expired');
    }
}

export class ValidationError extends AppError {
    constructor(error: any) {
        super(400, 'Error Validating Input', error);
    }
}

export class PictureNotFoundError extends AppError {
    constructor() {
        super(404, 'Picture Not Found');
    }
}

export class MessageNotFoundError extends AppError {
    constructor() {
        super(404, 'Message Not Found');
    }
}