import { PrismaService } from "../prisma.service";
import { Match } from "./profile.service";

export interface CardStats {
    win: number,
    lost: number,
    rank: number,
    friends: number,
}

export interface Activity {
    avatar: any,
    displayName: string,
    createdAt: Date,
    message: string,
}

export interface ProfileOverview {
    cardStats: CardStats,
    activities: Activity [],
    Matches: Match [],
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
                _count: {
                    select: {
                        winnedMatchs: true,
                        lostMatchs: true,
                    }
                },
                imgUrl: true,
                nickName: true,
                winnedMatchs: {
                    select: {
                        winnerScore: true,
                        looserScore: true,
                        looser: {
                            select: {
                                login: true,
                                imgUrl: true,
                                nickName: true,
                            }
                        }
                    },
                },
                lostMatchs: {
                    select: {
                        looserScore: true,
                        winnerScore: true,
                        winner: {
                            select: {
                                login: true,
                                imgUrl: true,
                                nickName: true,
                            }
                        }
                    }
                },
                //
            }
        });
        let profile = {} as ProfileOverview;
        if (usr) {

        }
        return profile;
    }
    catch (error) {
        console.log(error.message);
    }
}