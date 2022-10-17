import {IsNotEmpty, IsString, IsOptional, IsDate, IsBoolean} from "class-validator";

// https://github.com/typestack/class-validator#validation-decorators

export class IAccount {
    @IsString()
    login: string;
    @IsOptional()
    @IsString()
    firstName?: string;
    @IsOptional()
    @IsString()
    lastName?: string;
    @IsOptional()
    @IsString()
    nickName?: string;
    @IsOptional()
    @IsString()
    email?: string;
    @IsOptional()
    score?: number;
    @IsOptional()
    @IsString()
    avatar?: string;
    @IsOptional()
    win?: number;
    @IsOptional()
    lost?: number;
    @IsOptional()
    rank?: number;
    @IsOptional()
    winnedMatch?: any[];
    @IsOptional()
    lostMatch?: any[];
    @IsOptional()
    matches?: any[];
    @IsOptional()
    friends?: IAccount[];
    @IsOptional()
    n_friends?: number;
    @IsOptional()
    blockUsers?: string[];
    @IsOptional()
    blockedFrom?: string[];
    @IsOptional()
    @IsDate()
    createdAt?: Date;
    @IsOptional()
    @IsBoolean()
    isOnline?: boolean;
    @IsOptional()
    @IsBoolean()
    isAdmin?: boolean;
    @IsOptional()
    @IsBoolean()
    twoFA?: boolean;
    @IsOptional()
    @IsString()
    secret?: string;
    @IsOptional()
    @IsString()
    dataUrl?: string;
    @IsOptional()
    channelList?: IChannel[];
    @IsOptional()
    channelAdmin?: string[];
    @IsOptional()
    activities?: Activity[];
}

export class IChannel {
    // basic info
    @IsString()
    channelName: string;
    @IsOptional()
    @IsBoolean()
    isDirect?: boolean;
    @IsOptional()
    @IsBoolean()
    isPrivate?: boolean;
    @IsOptional()
    @IsString()
    creator?: string;
    @IsOptional()
    @IsString()
    password?: string;
    @IsOptional()
    @IsBoolean()
    is_pwd?: boolean;
    
    // advanced info
    @IsOptional()
    @IsDate()
    createdAt?: Date;
    @IsOptional()
    users?: IAccount[];
    @IsOptional()
    admins?: IAccount[];
    @IsOptional()
    mutedUsers?: IAccount[];
    @IsOptional()
    bannedUsers?: IAccount[];
    @IsOptional()
    messages?: IMessage[];
    
    // description?: string; // à rajouter par Juan
}

export class IPhoto {
    @IsString()
    filename: string;
    @IsString()
    path: string;
    @IsString()
    mimetype: string;
    size: number;
}

export class IMessage {
    @IsDate()
    createdAt: Date;
    @IsString()
    message: string;
    @IsString()
    from: string; // Est-ce que c'est le login !!!!
    @IsString()
    channelId: string;
    @IsOptional()
    @IsBoolean()
    isNotif?: boolean; //=> JUAN


}

// export interface CardStats {
//     win: number,
//     lost: number,
//     rank: number,
//     friends: number,
// }

export class Activity {
    avatar: any;
    @IsString()
    displayName: string;
    createdAt: Date;
    @IsString()
    message: string;
}

// export interface ProfilePublic {
//     cardStats: CardStats,
//     friends: Friend[],
//     matches: Match[],
// }

export class IPersoMatch {
    @IsString()
    usrAvatar: string;
    @IsString()
    usrDisplayName: string;
    usrScore: number;
    opScore: number;
    @IsString()
    opDisplayName: string;
    @IsString()
    opLogin: string;
    @IsString()
    opAvatar: string;
}

export class IMatch {
    @IsOptional()
    createdAt?: Date;
    gameId?: number;
    @IsString()
    winner: string;
    winnerScore: number;
    @IsString()
    looser: string;
    looserScore: number;
}

export class eventI {
    @IsString()
    from: string;
    @IsString()
    to: string;
    @IsOptional()
    eventDate?: Date;
    @IsOptional()
    eventDuration?: number;
}
