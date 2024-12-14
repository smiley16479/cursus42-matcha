import { EChatStatus, type MsgInput_t, type MsgOutput_t } from "@/type/shared_type/msg";

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

/** compute distance avec des lng et lat
 * @return: distance en km
 */
export function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
	const R = 6371; // Rayon de la Terre en kilomètres
	const toRad = (deg: number) => (deg * Math.PI) / 180;

	const dLat = toRad(lat2 - lat1);
	const dLon = toRad(lon2 - lon1);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c; // Distance en kilomètre
}

// ================== MSG UTILS ====================

export function initMsg(msg: MsgOutput_t | null = null): MsgOutput_t {
	return {
		id: msg?.id || -1,
		chatId: msg?.chatId || -1,
		userId: msg?.userId || -1,
		content: msg?.content || "",
		status: msg?.status || EChatStatus.UNREAD,
    date: msg?.date || "",
	}
}