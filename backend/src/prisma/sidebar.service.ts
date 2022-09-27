import { PrismaService } from "../prisma.service";

export interface ISidebar {
    fullName: string,
    login: string,
    avatar: string,
    friendsList: FriendsList[],
    friends: number
}

export interface FriendsList {
    fullName: string,
    login: string,
    avatar: string,
    isOnline: boolean
}

export async function getSidebar(this: PrismaService, login: string) {
    const usr = await this.prisma.user.findFirst({
        where: { login: login },
        select: {
            login: true,
            fullName: true,
            imgUrl: true,
            friends: {
                select: {
                    friend1: {
                        select: {
                            login: true,
                            fullName: true,
                            imgUrl: true,
                            isOnline: true,
                        }
                    }
                }
            },
            befriend: {
                select: {
                    friend2: {
                        select: {
                            login: true,
                            fullName: true,
                            imgUrl: true,
                            isOnline: true,
                        }
                    }
                }
            }
        }
    });
    let sidebar = {} as ISidebar;
    if (usr) {
        sidebar.login = usr.login;
        sidebar.fullName = usr.fullName;
        sidebar.avatar = usr.imgUrl;
        sidebar.friendsList = [];
        let count = 0;
        for (let i = 0; usr.friends && usr.friends[i]; i++) {
            let tmp: FriendsList;
            tmp.login = usr.friends[i].friend1.login;
            tmp.fullName = usr.friends[i].friend1.fullName;
            tmp.isOnline = usr.friends[i].friend1.isOnline;
            tmp.avatar = usr.friends[i].friend1.imgUrl;
            count++;
            sidebar.friendsList.push(tmp);
        }
        for (let i = 0; usr.befriend && usr.befriend[i]; i++) {
            let tmp: FriendsList;
            tmp.login = usr.befriend[i].friend2.login;
            tmp.fullName = usr.befriend[i].friend2.fullName;
            tmp.isOnline = usr.befriend[i].friend2.isOnline;
            tmp.avatar = usr.befriend[i].friend2.imgUrl;
            count++;
            sidebar.friendsList.push(tmp);
        }
        sidebar.friends = count;
    }
    return sidebar;
}