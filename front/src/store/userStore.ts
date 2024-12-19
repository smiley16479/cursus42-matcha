import {writable, get, derived} from 'svelte/store'
import { type IUserSelf, EGender, ESexualPref, type UserPic_t, EGeoPref } from '../type/shared_type/user';
import { LoggingState } from '@/type/user';

export class UserStore {
	user: IUserSelf & {password: string, prefGeoloc: EGeoPref, connectedUser: number[]} = {
		id: 0,
		userName:  "",
		firstName:  "",
		lastName:  "",
		gender:  EGender.Unknown,
		sexualPref:  ESexualPref.Both,
		biography:  "",
		fameRate:  0,
		latitude:  0,
		longitude:  0,
		lastConnection:  new Date(),
		profileVisibility: true,
		email:  "",
		emailVerified:  false,
		password:  "",
		interests: [],
		emailNotifications: false,
		maxDistance: 0,
		matchAgeMin: 18,
		matchAgeMax: 100,
		prefGeoloc: EGeoPref.Never,
		age: 0,
		visits: [],
		blocking: [],
		liking: [],
		likedBy: [],
		chats: [],
		notifications: [],
		connectedUser: [],
		pictures: [],
		isConnected: true
	}
	avatar = "";
	logState: LoggingState = LoggingState.unlogged;
}

export function refreshNotif(refreshMsg = true) {
	us.update((store) => {
		store.user.chats.forEach(e => {
			if (refreshMsg)
				e.msg.sort((a, b) => new Date((a as  any).date).getTime() - new Date((b as any).date).getTime());
			e.interlocutors.forEach(i => {
				store.user.liking.forEach( el => {
				if (el.likedUserId === i.id)
					store.user.liking = store.user.liking.filter(ele => ele.likedUserId !== i.id)
				})
				store.user.likedBy.forEach( el => {
				if (el.likerUser.id === i.id)
					store.user.likedBy = store.user.likedBy.filter(ele => ele.likerUser.id !== i.id)
				})
				store.user.visits.forEach( el => {
				if (el.visiterUser.id === i.id)
					store.user.visits = store.user.visits.filter(ele => ele.visiterUser.id !== i.id)
				})
			})
		});
		store.user.likedBy.forEach( i => {
			store.user.visits.forEach( el => {
			if (el.visiterUser.id === i.likerUser.id)
				store.user.visits = store.user.visits.filter(ele => ele.visiterUser.id !== i.likerUser.id)
			})
		})
		return {...store}
	})
}

export const us = writable<UserStore>(new UserStore());
//  Non ça log à tous les changements
// export const logState = derived(us, $us => (console.log(`smt Changed`), $us.user.age));