export interface IAccount {
    login: string;
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
}

export interface IChannel {
    // basic info
    channelName: string;
    isDirect?: boolean;
    isPrivate?: boolean;
    creator?: string;
    password?: string;
    is_pwd?: boolean;
    
    // advanced info
    createdAt?: Date;
    users?: IAccount[];
    admins?: IAccount[];
    mutedUsers?: IAccount[];
    bannedUsers?: IAccount[];
    messages?: IMessage[];
    
    // description?: string; // à rajouter par Juan
}

export interface IPhoto {
    filename: string;
    path: string;
    mimetype: string;
    size: number;
}

export interface IMessage {
    createdAt: Date;
    message: string;
    from: string;
}

// export interface CardStats {
//     win: number,
//     lost: number,
//     rank: number,
//     friends: number,
// }

// export interface Activity {
//     avatar: any,
//     displayName: string,
//     createdAt: Date,
//     message: string,
// }

// export interface ProfileOverview {
//     cardStats: CardStats,
//     activities: Activity [],
//     Matches: Match [],
// }

// export interface friendsList {
//     email: string,
//     login: string,
//     displayName: string,
//     imgUrl: string,
//     score: number,
//     isOnline: boolean,
//     win: Number,
//     lost: Number,
// }

// export interface ProfileSettings {
//     avatar: string,
//     displayName: string,
//     firstName: string,
//     lastName: string,
//     email: string,
//     login: string,
// }
// export interface ProfilePublic {
//     cardStats: CardStats,
//     friends: Friend[],
//     matches: Match[],
// }

export interface IPersoMatch {
    usrAvatar: string,
    usrDisplayName: string,
    usrScore: number,
    opScore: number,
    opDisplayName: string,
    opLogin: string,
    opAvatar: string,
}

export interface IMatch {
    createdAt?: Date;
    winner: string;
    winnerScore: number;
    looser: string;
    looserScore: number;
}

// export interface Profile {
//     firstName: string,
//     lastName: string,
//     email: string,
//     login: string,
//     displayName: string,
//     avatar: string,
// }

// export interface ISidebar {
//     fullName: string,
//     login: string,
//     avatar: string,
//     friendsList: FriendsList[],
//     friends: number
// }

// export interface FriendsList {
//     fullName: string,
//     login: string,
//     avatar: string,
//     isOnline: boolean
// }