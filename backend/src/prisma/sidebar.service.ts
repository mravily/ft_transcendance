import { PrismaService } from "../prisma.service";
import { IAccount } from "./interfaces";


export async function getSidebar(this: PrismaService, id: string): Promise<IAccount> {
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
    let sidebar = {} as IAccount;
    if (usr) {
        sidebar.login = usr.login;
        sidebar.nickName = usr.nickName;
        sidebar.avatar = usr.imgUrl;
        sidebar.friends = [];
        let count = 0;
        for (let i = 0; usr.friends && usr.friends[i]; i++) {
            let tmp: IAccount;
            tmp.login = usr.friends[i].requested.login;
            tmp.nickName = usr.friends[i].requested.nickName;
            tmp.isOnline = usr.friends[i].requested.isOnline;
            tmp.avatar = usr.friends[i].requested.imgUrl;
            count++;
            sidebar.friends.push(tmp);
        }
        for (let i = 0; usr.befriend && usr.befriend[i]; i++) {
            let tmp: IAccount;
            tmp.login = usr.befriend[i].requester.login;
            tmp.nickName = usr.befriend[i].requester.nickName;
            tmp.isOnline = usr.befriend[i].requester.isOnline;
            tmp.avatar = usr.befriend[i].requester.imgUrl;
            count++;
            sidebar.friends.push(tmp);
        }
        sidebar.n_friends = count;
    }
    return sidebar;
}