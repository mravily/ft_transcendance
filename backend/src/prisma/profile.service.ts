import { PrismaService } from "../prisma.service";
import { CardStats } from "./overview.service";

export interface ProfilePublic {
    cardStats: CardStats,
    friends: Friend[],
    matches: Match[],
}

export interface Match {
    usrAvatar: string,
    usrDisplayName: string,
    usrScore: number,
    opScore: number,
    opDisplayName: string,
    opLogin: string,
    opAvatar: string,
}

export interface Friend {
    displayName: string,
    avatar: string,
    login: string,
}

export interface Profile {
    firstName: string,
    lastName: string,
    email: string,
    login: string,
    displayName: string,
    avatar: string,
}

export async function getUserProfile(this: PrismaService, userId: string) {
    try {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                firstName: true,
                lastName: true,
                email: true,
                login: true,
                nickName: true,
                imgUrl: true,
            },
        });
        let profile = {} as Profile;
        if (user) {
            profile.firstName = user.firstName;
            profile.lastName = user.lastName;
            profile.email = user.email;
            profile.login = user.login;
            profile.displayName = user.nickName;
            profile.avatar = user.imgUrl;
        }
        return profile;
    }
    catch (error) {}
}

export async function getUserRank(this: PrismaService, userId: string): Promise<number> {
    try {
        const rank = await this.prisma.user.findMany({
            select: { id: true },
            orderBy: {score: 'desc'}
        });
        for (let i = 0; rank[i]; i++) {
            if (rank[i].id == userId) {
                return (i + 1);
            }
        }
        return 0;
    }
    catch (error) {
        console.log(error.message);
    }
}

export async function getPublicProfile(this: PrismaService, userId: string) {
    try {
        const user = await this.prisma.user.findUnique({
            where : { id: userId },
            select: {
                imgUrl: true,
                nickName: true,
                friends: {
                    select: {
                        isAccepted: true,
                        requester: {
                            select: {
                                nickName: true,
                                imgUrl: true,
                                login: true,
                            }
                        },
                    },
                },
                befriend: {
                    select: {
                        isAccepted: true,
                        requested: {
                            select: {
                                nickName: true,
                                imgUrl: true,
                                login: true,
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        winnedMatchs: true,
                        lostMatchs: true,
                    }
                },
                winnedMatchs: {
                    select: {
                        winnerScore: true,
                        looserScore: true,
                        looser: {
                            select: {
                                imgUrl: true,
                                nickName: true,
                                login: true,
                            }
                        },
                    }
                },
                lostMatchs: {
                    select: {
                        looserScore: true,
                        winnerScore: true,
                        winner: {
                            select: {
                                imgUrl: true,
                                nickName: true,
                                login: true,
                            }
                        },
                    }
                },
            },
        });
        let profile = {} as ProfilePublic;
        if (user) {
            profile.cardStats = {} as CardStats;
            profile.friends = [];
            profile.matches = [];
            profile.cardStats.friends = 0;
            profile.cardStats.rank = await this.getUserRank(userId);
            profile.cardStats.lost = user._count.lostMatchs;
            profile.cardStats.win = user._count.winnedMatchs;
            for (let i = 0; user.befriend[i]; i++) {
                if (user.befriend[i].isAccepted == true) {
                    let tmp = {} as Friend;
                    tmp.avatar = user.befriend[i].requested.imgUrl;
                    tmp.displayName = user.befriend[i].requested.nickName;
                    tmp.login = user.befriend[i].requested.login;
                    profile.friends.push(tmp);
                    profile.cardStats.friends++;
                }
            }
            for (let i = 0; user.friends[i]; i++) {
                if (user.friends[i].isAccepted == true) {
                    let tmp = {} as Friend;
                    tmp.avatar = user.friends[i].requester.imgUrl;
                    tmp.displayName = user.friends[i].requester.nickName;
                    tmp.login = user.friends[i].requester.login;
                    profile.friends.push(tmp);
                    profile.cardStats.friends++;
                }
            }
            for (let i = 0; user.winnedMatchs[i]; i++) {
                let tmp = {} as Match;
                tmp.opDisplayName = user.winnedMatchs[i].looser.nickName;
                tmp.opLogin = user.winnedMatchs[i].looser.login;
                tmp.opScore = user.winnedMatchs[i].looserScore;
                tmp.opAvatar = user.winnedMatchs[i].looser.imgUrl;
                tmp.usrAvatar = user.imgUrl;
                tmp.usrDisplayName = user.nickName;
                tmp.usrScore = user.winnedMatchs[i].winnerScore;
                profile.matches.push(tmp);
            }
            for (let i = 0; user.lostMatchs[i]; i++) {
                let tmp = {} as Match;
                tmp.opDisplayName = user.lostMatchs[i].winner.nickName;
                tmp.opLogin = user.lostMatchs[i].winner.login;
                tmp.opScore = user.lostMatchs[i].winnerScore;
                tmp.opAvatar = user.lostMatchs[i].winner.imgUrl;
                tmp.usrAvatar = user.imgUrl;
                tmp.usrDisplayName = user.nickName;
                tmp.usrScore = user.lostMatchs[i].looserScore;
                profile.matches.push(tmp);
            }
        }
        return profile;
    }
    catch (error) {
        console.log(error.message);
    }
}