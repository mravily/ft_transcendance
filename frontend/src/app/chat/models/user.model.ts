export interface UserI { 
  /*
  id?: number; // OK OUT
  username?: string; // OK OUT
  password?: string; // A SUPPR
  */
  login: string;
  createdAt?: Date;
  name?: string;
  email: string;
  level?: number;
  score?: number;
  atoken?: string;
  rtoken?: string;
  photo?: string;
  twoFA?: boolean
  twoFApwd?: string;
// // Oposit Relations:
//   channelList: JoinChannel[];
//   mutedChannel: muteUser[];
//   adminChannel: makeAdmin[];
//   winnedMatchs:  Match[];
//   lostMatchs:  Match[];
//   channelMessage: ChannelMessage[];
//   privMessageSent: PrivMessage[];
//   privMessageReceived: PrivMessage[];
//   friends: AddFriend[];
//   befriend: AddFriend[];
//   blockedUsers: BlockUser[];
//   blockedFrom: BlockUser[];
//   bannedFrom: BanUser[];
}