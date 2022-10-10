
export class CardStats {
	win!: number
	lost!: number
	rank!: number
	friends!: number
}

export class Activity {
	avatar!: any
	displayName!: string
	createdAt!: Date
	message!: string
}

export class Match {
	usrAvatar!: any
	usrDisplayName!: string
	usrScore!: number
	opScore!: number
	opAvatar!: any
	opDisplayName!: string
	opLogin!: string
}

export class ProfileOverview {
	cardStats!: CardStats
	activities!: Activity []
	matches!: Match []
}

export class ProfilePublic {
	cardStats!: CardStats
	friends!: Friend []
	matches!: Match []
}

export class friendsList {
	email!: string
	login!: string
	displayName!: string
	imgUrl!: string 
	score!: number
	isOnline!: boolean
	win!: Number
	lost!: Number
}

export class ProfileSettings {
	avatar!: any
	displayName!: string
	firstName!: string
	lastName!: string
	email!: string
	login!: string
}

export class Friend {
	displayName!: string
	avatar!: string
	login!: string
}

export class Profile {
	firstName!: string
	lastName!: string
	email!: string
	login!: string
	displayName!: string
	avatar!: any
}