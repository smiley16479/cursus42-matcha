

/** type minimal */
export type User_tm = {
	id?: number,
	userName: string,
	avatar: string,
	sex: boolean,
  orient?: SexOrientation,
}

/** type générique */
export type User_t = User_tm & {
	email: string,
	isEmailConfirmed?: boolean,
	password: string,
	bio: string,
}

export enum SexOrientation {
  Straight = "Straight",
  Gay = "Gay",
  Bisexual = "Bisexual",
  Other = "Other"
};

export enum LoggingState {
	unlogged,
	logged,
	logging,
	loggingFailled,
	signUp,
	emailNotConfirm,
}

/** class permettant de changer de password*/
export class UserChPw_ce {
	constructor(
		/** userId */
		public id: number = 0,
		/** Old Password */
		public oldPw: string = "", // "Old_password",
		/** New Password */
		public  newPw: string = "", // "New_password"
	) {}
}