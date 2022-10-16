import { Activity } from "../features/profile/models/profile.user.model";

export class IAccount {
	login!: string;
	firstName?: string;
	lastName?: string;
	nickName?: string;
	email?: string;
	score?: number;
	avatar?: string;
	win?: number;
	lost?: number;
	rank?: number;
	winnedMatch?: any[];
	lostMatch?: any[];
	matches?: any[];
	friends?: IAccount[];
	n_friends?: number;
	blockUsers?: any[];
	createdAt?: Date;
	isOnline?: boolean;
	isAdmin?: boolean;
	twoFA?: boolean;
	secret?: string;
	dataUrl?: string;
	channelList?: any[];
	channelAdmin?: any[];
	activities?: Activity[];
  }
