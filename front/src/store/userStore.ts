import {writable, get} from 'svelte/store'
import { type IUser, EGender, ESexualPref, type UserPic_t, EGeoPref } from '../type/shared_type/user';
import { LoggingState } from '@/type/user';

export class UserStore {
	user: IUser & {interests : string[], prefGeoloc: EGeoPref} = {
		// id: 0,
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
		prefGeoloc: EGeoPref.Never
	}
	pictures: UserPic_t[] = [];
	avatar = "";
	logState: LoggingState = LoggingState.unlogged;
}

export const us = writable<UserStore>(new UserStore());