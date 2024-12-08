import {writable, get, derived} from 'svelte/store'
import { type IUserSelf, EGender, ESexualPref, type UserPic_t, EGeoPref } from '../type/shared_type/user';
import { LoggingState } from '@/type/user';

export class UserStore {
	user: IUserSelf & {password: string, prefGeoloc: EGeoPref, likes: []} = {
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
		likes: [],
		blocking: [],
		liking: [],
		likedBy: [],
		chats: [],
		notifications: [],
		pictures: [],
		isConnected: true
	}
	avatar = "";
	logState: LoggingState = LoggingState.unlogged;
}

export const us = writable<UserStore>(new UserStore());
//  Non ça log à tous les changements
// export const logState = derived(us, $us => (console.log(`smt Changed`), $us.user.age));