/** Fonction pour parser les cookies */
export function parseCookies(cookieHeader: string): Record<string, string> {
	const cookies: Record<string, string> = {};
	cookieHeader.split(';').forEach(cookie => {
        const [name, ...rest] = cookie.split('=');
        cookies[name.trim()] = rest.join('=');
    });
    return cookies;
}