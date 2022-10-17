
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

export class tfa {
	dataUrl?: string
	secret?: string
}

export class IProfileFriends {
    nickName!: string
	avatar!: string
    login!: string
    win!: number
    lost!: number
	rank!: number
    isOnline!: boolean
    isAccepted!: boolean
    score!: number
    isSent!: boolean
}