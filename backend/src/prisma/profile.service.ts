import { PrismaService } from "../prisma.service";
import { IAccount, IMatch, IPersoMatch } from "./interfaces";

export async function getUserProfile(this: PrismaService, userId: string): Promise<IAccount> {
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
        let profile = {} as IAccount;
        if (user) {
            profile.firstName = user.firstName;
            profile.lastName = user.lastName;
            profile.email = user.email;
            profile.login = user.login;
            profile.nickName = user.nickName;
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

export async function getPublicProfile(this: PrismaService, login: string): Promise<IAccount> {
    try {
        const user = await this.prisma.user.findUnique({
            where : { login: login },
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
        let profile = {} as IAccount;
        if (user) {
            profile.friends = [];
            profile.matches = [];
            profile.n_friends = 0;
            profile.rank = await this.getUserRank(login);
            profile.lost = user._count.lostMatchs;
            profile.win = user._count.winnedMatchs;
            for (let i = 0; user.befriend[i]; i++) {
                if (user.befriend[i].isAccepted == true) {
                    let tmp = {} as IAccount;
                    tmp.avatar = user.befriend[i].requested.imgUrl;
                    tmp.nickName = user.befriend[i].requested.nickName;
                    tmp.login = user.befriend[i].requested.login;
                    profile.friends.push(tmp);
                    profile.n_friends++;
                }
            }
            for (let i = 0; user.friends[i]; i++) {
                if (user.friends[i].isAccepted == true) {
                    let tmp = {} as IAccount;
                    tmp.avatar = user.friends[i].requester.imgUrl;
                    tmp.nickName = user.friends[i].requester.nickName;
                    tmp.login = user.friends[i].requester.login;
                    profile.friends.push(tmp);
                    profile.n_friends++;
                }
            }
            for (let i = 0; user.winnedMatchs[i]; i++) {
                let tmp = {} as IPersoMatch;
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
                let tmp = {} as IPersoMatch;
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