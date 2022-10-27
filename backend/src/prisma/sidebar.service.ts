import { PrismaService } from '../prisma.service';
import { IAccount } from '../interfaces';

export async function getSidebar(this: PrismaService, id: string): Promise<IAccount> {
  try { 
    const usr = await this.prisma.user.findUnique({
      where: { id: id },
      select: {
        login: true,
        nickName: true,
        imgUrl: true,
        friends: {
          select: {
            isAccepted: true,
            requester: {
              select: {
                login: true,
                nickName: true,
                imgUrl: true,
                isOnline: true,
              },
            },
          },
        },
        befriend: {
          select: {
            isAccepted: true,
            requested: {
              select: {
                login: true,
                nickName: true,
                imgUrl: true,
                isOnline: true,
              },
            },
          },
        },
      },
    });
    let sidebar = {} as IAccount;
    if (usr) {
      sidebar = {
        login: usr.login,
        nickName: usr.nickName,
        avatar: usr.imgUrl,
        friends: [],
        n_friends: 0,
      }
      for (let i in usr.friends) {
        if (usr.friends[i].isAccepted == true) {
          sidebar.n_friends++;
          sidebar.friends.push({
            login: usr.friends[i].requester.login,
            nickName: usr.friends[i].requester.nickName,
            isOnline: usr.friends[i].requester.isOnline,
            avatar: usr.friends[i].requester.imgUrl,
          });
        }
      }
      for (let i in usr.befriend) {
        if (usr.befriend[i].isAccepted == true) {
          sidebar.n_friends++,
          sidebar.friends.push({
            login: usr.befriend[i].requested.login,
            nickName: usr.befriend[i].requested.nickName,
            isOnline: usr.befriend[i].requested.isOnline,
            avatar: usr.befriend[i].requested.imgUrl,
          });
        }
      }
    }
    return sidebar;
  }
  catch (error) {
    //console.log('Sidebar service', error.message);
    return {} as IAccount;
  }
}
