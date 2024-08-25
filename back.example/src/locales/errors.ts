export const badRequest = {
    default: 'Requête invalide.',
    notEmpty: (label: string) => `${label} ne doit pas être vide.`,
    isString: (label: string) => `${label} doit être une chaîne de caractères.`,
    isBoolean: (label: string) => `${label} doit être un booléen.`,
    isInt: (label: string) => `${label} doit être un entier.`,
    isFloat: (label: string) => `${label} doit être un nombre (flottant).`,
    isDate: (label: string) => `${label} doit être une Date.`,
    isEmail: (label: string) => `${label} doit être une adresse email.`,
    isURL: (label: string) => `${label} doit être une URL commençant par http://.`,
    isArray: (label: string) => `${label} doit être un Array.`,
    isTime: (label: string) => `${label} doit être une Heure.`,
    maxLength: (label: string, max: number) => `${label} ne doit pas contenir plus de ${max.toString()} caractères.`,
    optional: (label: string) => `${label} est obligatoire`,
};

export const unauthorized = {
    default: 'Identifiant et/ou mot de passe incorrect.',
    withNoToken: 'Un token est requis pour accéder à cette ressource.',
    withInvalidToken: 'Le token est invalide.',
    withRemainingAttempts: (remaining: number) => `Identifiant et/ou mot de passe incorrect, ${remaining} tentatives restantes.`,
    withNoRemainingAttempts: 'Identifiant ou mot de passe invalide, votre compte est verrouillé pour 1h.',
};

export const forbidden = {
    default: 'Vous n\'êtes pas autorisé effectuer cette action.',
    lockedWithRemainingMs: (ms: number) => {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const formatted = hours > 0 ? 
            `${hours} heures ${minutes} minutes ${seconds} secondes` :
            `${minutes} minutes ${seconds} secondes`;
        
        return `Ce compte est verrouillé pendant encore ${formatted}.`;
    },
};

export const notFound = {
    default: 'Ressource introuvable.',
    activity: (id: number) => `L'activité ${id.toString()} est introuvable.`,
    interview: (id: number) => `L'entretien ${id.toString()} est introuvable.`,
};

export const internal = {
    default: 'Une erreur est survenue.',
};

export const uniqueConstraint = {
    default: 'Il y a un conflit.',
};
