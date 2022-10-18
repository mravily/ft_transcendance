import { IsNumber, IsNotEmpty, IsString, IsOptional, IsDate, IsBoolean, MaxLength} from "class-validator";
import { Type } from 'class-transformer';

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
    @Type(() => Number)
    @IsNumber()
    score?: number;
    @IsOptional()
    @IsString()
    avatar?: string;
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    win?: number;
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    lost?: number;
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
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
    @Type(() => Number)
    @IsNumber()
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
    @Type(() => Number)
    @IsNumber()
    usrScore: number;
    @Type(() => Number)
    @IsNumber()
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
    @Type(() => Number)
    @IsNumber()
    gameId?: number;
    @IsString()
    winner: string;
    @Type(() => Number)
    @IsNumber()
    winnerScore: number;
    @IsString()
    looser: string;
    @Type(() => Number)
    @IsNumber()
    looserScore: number;
    winnerAvatar?: string;
    looserAvatar?: string;
}

export class eventI {
    @IsString()
    from: string;
    @IsString()
    to: string;
    @IsOptional()
    eventDate?: Date;
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    eventDuration?: number;
}
