export const RoleCodes = {
    User: 'ROLE_UTILISATEUR',
    Admin: 'ROLE_ADMIN',
    Consulting: 'ROLE_CONSULTATION',
    Associate: 'ROLE_ASSOC',
    HumanResource: 'ROLE_RH',
    SubContracting: 'ROLE_SOUSTRAITANT',
} as const;
export type RoleCodes = typeof RoleCodes[keyof typeof RoleCodes];