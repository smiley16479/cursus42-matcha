import { writable } from 'svelte/store';
import { io, type Socket } from "socket.io-client";

export const socket = writable<Socket>(io(import.meta.env.VITE_SOCKET_URL, {
	// secure: true, <- non ça sert à rien
		// extraHeaders: {
		// },
	}));