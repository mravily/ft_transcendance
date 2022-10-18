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
    blockUsers?: string[];
    blockedFrom?: string[];
    createdAt?: Date;
    isOnline?: boolean;
    isAdmin?: boolean;
    twoFA?: boolean;
    secret?: string;
    dataUrl?: string;
    channelList?: IChannel[];
    channelAdmin?: string[];
    activities?: Activity[];
}

export interface IChannel {
    // basic info
    channelName: string;
    realName?: string;
    imgUrl?: string;

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
    from: string; // Est-ce que c'est l'ID ou le login ?
    channelId: string;
    isNotif?: boolean;


}

// export interface CardStats {
//     win: number,
//     lost: number,
//     rank: number,
//     friends: number,
// }

export interface Activity {
    avatar: any,
    displayName: string,
    createdAt: Date,
    message: string,
}

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

export interface eventI {
    from: string;
    to: string;
    eventDate?: Date;
    eventDuration?: number;
}

export class IMatch {
    gameId!: number;
    winner!: string;
    winnerScore!: number;
    looser!: string;
    looserScore!: number;
    winnerAvatar!: string;
    looserAvatar!: string;
}