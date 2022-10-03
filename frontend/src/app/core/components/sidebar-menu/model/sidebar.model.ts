
export class SideBarData {
	fullName!: string
	login!: string
	avatar: any
	friendsList!: FriendsList[]
	friends!: number
}

export class FriendsList {
	fullName!: string
	login!: string
	avatar: any
	isOnline!: boolean
}