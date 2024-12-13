import { writable, get } from 'svelte/store';
import { io, type Socket } from "socket.io-client";
import { initMsg } from '@/service/util/sharedFunction';
import { type MsgInput_t, type MsgOutput_t } from '@/type/shared_type/msg';
import { parseCookies } from '@/service/util/sharedFunction';
import type { SocketResponse } from '@/type/event';
import { us } from './userStore';
import { Chat_c } from '@/type/shared_type/chat';
import type { UserLikedBy_t } from '@/type/shared_type/user';
import { type Notif_T, Notif_t_E } from '@/type/shared_type/notification';
import { app } from "@/store/appStore";


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

	// store1.socket.on('s_send_msg', (msg: MsgOutput_t) => {
	// 	console.log(`s_send_msg`, msg);
	// 	us.update((store) => {
	// 		const chat = store.user.chats.find(e => e.id === msg.chatId)
	// 		chat?.msg.push(msg);
	// 		return {
	// 			...store
	// 		};
	// 	})
	// });

	store1.socket.on('s_new_notification', (notif: Notif_T) => {
		us.update((store) => {
			store.user?.notifications?.push(notif);
		    switch(notif.type) {
				case Notif_t_E.LIKE:
					store.user?.likedBy?.push(notif.payload);
					break;
				case Notif_t_E.MATCH:
		        	store.user?.chats?.push(notif.payload);
					break;
				case Notif_t_E.MSG:
					const chat = store.user?.chats?.find(e => e.id === notif.payload.chatId)
		        	chat?.msg?.push(notif.payload);
					const appStore = get(app);
					if (appStore.userViewingChat == notif.payload.chatId) {
						store.user.notifications = store.user.notifications.filter(item => item.id !== notif.id);
					}
					break;
				case Notif_t_E.VISIT:
					store.user?.visits?.push(notif.payload);
					break;
				case Notif_t_E.UNLIKE:
					store.user.likedBy = store.user.likedBy.filter(item => item.id !== notif.payload.id);
					break;
		    	}
			return {
				...store
			};
		})
	});

	
	// store1.socket.on('s_like', ( like: UserLikedBy_t | Chat_c ) => {
	// 	console.log(`s_like new Chat`, like);
	// 	updateLikeOrMatch(like);
	// });
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
				console.log("Socket visit completed", response.data);
				// us.update((store) => {
					// store.user.visits.push(response.data) // user visits are the visits he got not the ones he made, so this one shouldn't be pushed here ?
				// 	return {
				// 		...store
				// 	};
				// });
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
				us.update((store) => {
					store.user.liking.push(response.data.newLiking);
					if (response.data.newChat)
						store.user.chats.push(response.data.newChat)
					return {
						...store
					};
				});
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
				us.update((store) => {
					store.user.liking = store.user.liking.filter(item => item.id !== response.data.removedLikeId);
					if (response.data.newBlock)
						store.user.blocking.push(response.data.newBlock);
					return {
						...store
					};
				});
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
export function block(blockedUserId: number) {
	try {
		const socket = getSocketOrThrow();
		socket.emit('c_block', blockedUserId, (response: SocketResponse) => {
			clearTimeout(timer);
			if (response.success) {
				console.log("Socket block completed");
				us.update((store) => {
					store.user.blocking.push({date: new Date(), blockedUserId});
					return {
						...store
					};
				});
			} else {
				console.error("Error received:", response.error);
			}
		});
	} catch (err) {
		printError(err);
	}
}

/** unblock un user
 * @param: blockdUserId
*/
export function unblock(unblockUserId: number) {
	try {
		const socket = getSocketOrThrow();
		socket.emit('c_unblock', unblockUserId, (response: SocketResponse) => {
			clearTimeout(timer);
			if (response.success) {
				console.log("Socket unblock completed");
				us.update((store) => {
					store.user.blocking = store.user.blocking.filter(item => item.blockedUserId !== unblockUserId);
					return {
						...store
					};
				});
			} else {
				console.error("Error received:", response.error);
			}
		});
	} catch (err) {
		printError(err);
	}
}

/** créer un report "Fake account"
 * @param: reportedUserId
*/
export function report(reportedUserId: number) {
	try {
		const socket = getSocketOrThrow();
		socket.emit('c_report', reportedUserId, (response: SocketResponse) => {
			clearTimeout(timer);
			if (response.success) {
				console.log("Socket report completed");
				alert("Report completed");
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

export function markNotificationRead(notificationId: number) {
	try {
		const socket = getSocketOrThrow();
		socket.emit('c_read_notif', notificationId, (response: SocketResponse) => {
			clearTimeout(timer);
			if (response.success) {
				console.log("Socket notification read completed");
				us.update((store) => {
					store.user.notifications = store.user.notifications.filter(item => item.id !== notificationId);
					return {
						...store
					};
				});
			} else {
				console.error("Error received:", response.error);
			}
		})	
	} catch (err) {
		printError(err);
	}
}

// Fonction pour fermer la connexion
export function closeSocket() {
	soc.update(store => {
			if (store && store.socket) {
				store.socket.removeAllListeners();
				store.socket.disconnect();
			}
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

function updateLikeOrMatch(like: Chat_c | UserLikedBy_t) {
	us.update((store) => {
		if ("msg" in like) {
			console.log(`instance of Chat_c`);
			const otherUser = like.interlocutors[0].id !== store.user.id ? like.interlocutors[0].id : like.interlocutors[1].id;
			store.user.likedBy = store.user.likedBy.filter(e => e.id !== otherUser);
			store.user.chats.push(like);
		}
		else //if ("likedUserId" in like) 
		{
			console.log(`instance of UserLikedBy_t`);
			store.user.likedBy.push(like);
		}
		return {
			...store
		};
	});
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
