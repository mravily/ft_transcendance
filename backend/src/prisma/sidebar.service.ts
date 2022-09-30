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

export async function getSidebar(this: PrismaService, id: string) {
    const usr = await this.prisma.user.findFirst({
        where: { id: id },
        select: {
            login: true,
            nickName: true,
            imgUrl: true,
            friends: {
                select: {
                    requested: {
                        select: {
                            login: true,
                            nickName: true,
                            imgUrl: true,
                            isOnline: true,
                        }
                    }
                }
            },
            befriend: {
                select: {
                    requester: {
                        select: {
                            login: true,
                            nickName: true,
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
        sidebar.fullName = usr.nickName;
        sidebar.avatar = usr.imgUrl;
        sidebar.friendsList = [];
        let count = 0;
        for (let i = 0; usr.friends && usr.friends[i]; i++) {
            let tmp: FriendsList;
            tmp.login = usr.friends[i].requested.login;
            tmp.fullName = usr.friends[i].requested.nickName;
            tmp.isOnline = usr.friends[i].requested.isOnline;
            tmp.avatar = usr.friends[i].requested.imgUrl;
            count++;
            sidebar.friendsList.push(tmp);
        }
        for (let i = 0; usr.befriend && usr.befriend[i]; i++) {
            let tmp: FriendsList;
            tmp.login = usr.befriend[i].requester.login;
            tmp.fullName = usr.befriend[i].requester.nickName;
            tmp.isOnline = usr.befriend[i].requester.isOnline;
            tmp.avatar = usr.befriend[i].requester.imgUrl;
            count++;
            sidebar.friendsList.push(tmp);
        }
        sidebar.friends = count;
    }
    return sidebar;
}