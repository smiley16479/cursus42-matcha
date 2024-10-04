import { writable, get } from 'svelte/store';
import { io, type Socket } from "socket.io-client";
import type { Notif_T } from '@/type/shared_type/notification';
import {type Msg_t, initMsg } from '@/type/shared_type/msg';

export const soc = writable<{socket: Socket | null, msg: Msg_t, notif: Notif_T | null}>({
	socket: io(import.meta.env.VITE_SOCKET_URL), //null,
	msg: initMsg(),
	notif: null
});

// Fonction pour initialiser le socket
export function initializeSocket() {
	// const socket = io(import.meta.env.VITE_SOCKET_URL);
	const store = get(soc);
	if (!store.socket)
		throw new Error("!store.socket")
	store.socket.on('connect', () => {
		console.log('Socket connecté:', store.socket?.id);
	});

	store.socket.on('s_receiveMsg', (msg) => {
		soc.update(store => {
			return {
				...store,
				msg
			};
		});
	});
	soc.set({socket : store.socket, msg: initMsg(), notif: null});
}

/** Fonction pour se connecter à un chat  */
export function joinRoom(chatId: number) {
	soc.update(store => {
		if (store && store.socket)
			store.socket.emit('c_joinRoom', chatId);
		return {...store}
	});
}
// Fonction pour envoyer un message
export function sendTxtMsg(msg: string) {
	const store = get(soc);
	// ou: //
	// soc.update(store => {
		if (store && store.socket)
			store.socket.emit('c_sendTxtMsg', msg);
		else
			throw new Error("!(store && store.socket)")
		// return store;
	// });
}

export function sendVocalMsg(msg: string) {
	const store = get(soc);
		if (store && store.socket)
			store.socket.emit('c_sendVocalMsg', msg);
		else
			throw new Error("!(store && store.socket)");
		console.log(`sendVocalMsg`, msg);
}

// Fonction pour fermer la connexion
export function closeSocket() {
	soc.update(store => {
			if (store && store.socket)
					store.socket.disconnect();
			return { socket: null, msg: initMsg(), notif: null };
	});
}

export default soc;