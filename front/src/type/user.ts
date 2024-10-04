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