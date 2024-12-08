import { writable, get } from 'svelte/store';
import { io, type Socket } from "socket.io-client";
import type { Notif_T } from '@/type/shared_type/notification';
import { initMsg } from '@/service/util/sharedFunction';
import { type MsgInput_t, type MsgOutput_t } from '@/type/shared_type/msg';
import { parseCookies } from '@/service/util/sharedFunction';
import type { SocketResponse } from '@/type/event';

export const soc = writable<{socket: Socket | null, msg: MsgOutput_t | null, notif: Notif_T | null}>({
	socket: null, //io(import.meta.env.VITE_SOCKET_URL, { withCredentials: true }),
	msg: null,
	notif: null
});

/** Fonction pour initialiser le socket */
export function initializeSocket() {
	// const socket = io(import.meta.env.VITE_SOCKET_URL);
	const store = get(soc);

	const cookies = parseCookies(document.cookie);
	console.log(`initializeSocket cookies.token`, cookies.token);
	if (!store.socket)
		soc.set({
			socket : io(import.meta.env.VITE_SOCKET_URL, { withCredentials: true,
				extraHeaders: {
					token: `Bearer ${cookies.token}`
				}
			}),
			msg: initMsg(),
			notif: null
		});
	else
		return;

	const store1 = get(soc);
	if (!store1.socket) {
		console.error("!store1.socket");
		return;
	}
	store1.socket.on('connect', () => {
		console.log('Socket connecté:', store1.socket?.id);
	});

	store1.socket.on('s_send_msg', (msg: MsgOutput_t) => {
		console.log(`s_send_msg`, msg);
		soc.update(store1 => {
			return {
				...store1,
				msg
			};
		});
	});

	
	store1.socket.on('s_like', (chatId: number) => {
		console.log(`s_like new ChatId`, chatId);
		soc.update(store1 => {
			return {
				...store1,
			};
		});
	});
}

/** Fonction pour se connecter à un chat  */
export function joinRoom(chatId: number) {
	soc.update(store => {
		if (store && store.socket)
			store.socket.emit('c_joinRoom', chatId);
		return {...store}
	});
}

/** Fonction pour envoyer un message 
 * @param msg: string
*/
export function send_msg(msg: MsgInput_t) {
	try {
		const socket = getSocketOrThrow();
		socket.emit('c_send_msg', msg, (response: SocketResponse) => {
			clearTimeout(timer);
			if (response.success) {
				console.log("Socket send_msg completed");
			} else {
				console.error("Socket not available. Message not sent.", response.error)
			}
		});
	} catch (err) {
		printError(err);
	}
}

/** notifier une visite 
 * @param: visitedUserId
*/
export function visit(visitedUserId: number) {
	try {
		const socket = getSocketOrThrow();
		socket.emit('c_visit', visitedUserId, (response: SocketResponse) => {
			clearTimeout(timer);
			if (response.success) {
				console.log("Socket visit completed");
			} else {
				console.error("Error received:", response.error);
			}
		});
	} catch (err) {
		printError(err);
	}
}

/** créer un like 
 * @param: likedUserId
*/
export function like(likedUserId: number) {
	try {
		const socket = getSocketOrThrow();
		socket.emit('c_like', likedUserId, (response: SocketResponse) => {
			clearTimeout(timer);
			if (response.success) {
				console.log("Socket like completed", response.data);
			} else {
				console.error("Error received:", response.error);
			}
		});
	} catch (err) {
		printError(err);
	}
}

/** Unlike un profil
 * @param: unlikedUserId
*/
export function unlike(unlikedUserId: number) {
	try {
		const socket = getSocketOrThrow();
		socket.emit('c_unlike', unlikedUserId, (response: SocketResponse) => {
			clearTimeout(timer);
			if (response.success) {
				console.log("Socket unlike completed");
			} else {
				console.error("Error received:", response.error);
			}
		});
	} catch (err) {
		printError(err);
	}
}


/** créer un block 
 * @param: blockdUserId
*/
export function block(blockdUserId: number) {
	try {
		const socket = getSocketOrThrow();
		socket.emit('c_block', blockdUserId, (response: SocketResponse) => {
			clearTimeout(timer);
			if (response.success) {
				console.log("Socket block completed");
			} else {
				console.error("Error received:", response.error);
			}
		});
	} catch (err) {
		printError(err);
	}
}

/** créer un report
 * @param: reportedUserId
*/
export function report(reportedUserId: number) {
	try {
		const socket = getSocketOrThrow();
		socket.emit('c_report', reportedUserId, (response: SocketResponse) => {
			clearTimeout(timer);
			if (response.success) {
				console.log("Socket report completed");
			} else {
				console.error("Error received:", response.error);
			}
		});
	} catch (err) {
		printError(err);
	}
}

export function sendVocalMsg(msg: string) {
	const store = get(soc);
		if (store && store.socket)
			store.socket.emit('c_sendVocalMsg', msg);
		else
			console.warn("Socket not available. Message not sent.");
		console.log(`sendVocalMsg`, msg);
}

// Fonction pour fermer la connexion
export function closeSocket() {
	soc.update(store => {
			if (store && store.socket)
					store.socket.disconnect();
			return { socket: null, msg: null, notif: null };
	});
}

//////////////// UTILITAIRES ///////////////////

const timeout = 10000;

/** TimeOut de 10sec */
const timer = setTimeout(() => {
  console.error("No response received within the timeout.");
}, timeout);

function getSocketOrThrow() {
	const store = get(soc);
	if (store && store.socket) {
		return store.socket;
	} else {
		throw new Error("Socket is not initialized.");
	}
}

function printError(err: unknown) {
	if (err instanceof Error) {
		console.error(err.message);
	} else {
		console.error("An unknown error occurred:", err);
	}
}

/*
  onMount(() => {
    // Si des listeners spécifiques sont nécessaires
    socket.on('user_connected', (user) => {
      console.log(`${user} connected`);
    });

    return () => {
      // Nettoyer les listeners si nécessaire
      socket.off('user_connected');
    };
  });

*/

export default soc;
