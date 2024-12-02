// Fonction pour générer un identifiant de room unique pour deux utilisateurs
export const generateRoomId = (userId1, userId2) => {
  return [userId1, userId2].sort().join('-');
};

/**Array d'id de tous les users en ligne */
export const connectedUser: number[] = []