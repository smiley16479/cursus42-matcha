export const lockedAccount = {
    subject: 'Un compte a été vérouillé',
    text: (username: string) => `Après plusieurs tentatives de connexion sans succès, le compte avec l'identifiant "${username}" a été bloqué pendant 1h.`,
};

export const resetPassword = {
    subject: 'Nouveau mot de passe',
    text: (newPassword: string) => `Nouveau mot de passe: ${newPassword}`,
};
