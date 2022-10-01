import { PrismaService } from "../prisma.service";

export interface CardStats {
    win: number,
    lost: number,
    fiendsOnline: number,
    friends: number,
}

export interface RecentActivity {
    avatar: any,
    displayName: string,
    createdAt: Date,
    message: string,
}

export interface MatchRequest {
    avatar: any,
    displayName: string,
    login: string,
    win: number,
    lost: number,
    isOnline: boolean,
}

export interface ProfileOverview {
    cardStats: CardStats,
    RecentActivity: RecentActivity [],
    MatchRequest: MatchRequest [],
}

export interface friendsList {
    email: string,
    login: string,
    displayName: string,
    imgUrl: string,
    score: number,
    isOnline: boolean,
    win: Number,
    lost: Number,
}

export interface ProfileSettings {
    avatar: string,
    displayName: string,
    firstName: string,
    lastName: string,
    email: string,
    login: string,
}

export async function getProfileOverview(this: PrismaService, login: string) {
    try {
        const usr = await this.prisma.user.findUnique({
            where: { login: login },
            select: {
                //
            }
        });
    }
    catch (error) {
        console.log(error.message);
    }
}