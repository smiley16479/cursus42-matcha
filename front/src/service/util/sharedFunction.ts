/** Fonction pour parser les cookies */
export function parseCookies(cookieHeader: string): Record<string, string> {
	const cookies: Record<string, string> = {};
	cookieHeader.split(';').forEach(cookie => {
        const [name, ...rest] = cookie.split('=');
        cookies[name.trim()] = rest.join('=');
    });
    return cookies;
}

/** permet de décoder de l'HTML */
export function decodeHtmlEntities(str: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = str;
    return tempDiv.textContent || str;
  }