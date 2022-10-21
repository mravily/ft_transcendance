import { PrismaService } from "../prisma.service";
import { IAccount } from "../interfaces";

export async function getTotalFiends(this: PrismaService, login: string): Promise<number> {
  try {
    const user = await this.prisma.user.findUnique({
      where: { login: login },
      select: {
        friends: {
          select: {
            isAccepted: true,
          },
        },
        befriend: {
          select: {
            isAccepted: true,
          },
        },
      },
    });
    let n = 0;
    for (let i in user.befriend) {
      if (user.befriend[i].isAccepted == true) {
        n++;
      }
    }
    for (let i in user.friends) {
      if (user.friends[i].isAccepted == true) {
        n++;
      }
    }
    return n;
  } catch (error) {
    //console.log(error.message);
  }
}

export async function getProfileOverview(this: PrismaService, userid: string): Promise<IAccount> {
  try {
    const usr = await this.prisma.user.findUnique({
      where: { id: userid },
      select: {
        _count: {
          select: {
            winnedMatchs: true,
            lostMatchs: true,
          },
        },
        login: true,
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
              },
            },
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
              },
            },
          },
        },
        friends: {
          select: {
            isAccepted: true,
            createdAt: true,
            requester: {
              select: {
                nickName: true,
                imgUrl: true,
              },
            },
          },
        },
      },
    });
    let profile = {} as IAccount;
    if (usr) {
      profile = {
        activities: [],
        matches: [],
        login: usr.login,
        win: usr._count.winnedMatchs,
        lost: usr._count.lostMatchs,
        rank: await this.getUserRank(usr.login),
        n_friends: await this.getTotalFriends(usr.login),
      }
      for (let i in usr.winnedMatchs) {
        profile.matches.push({
          usrAvatar: usr.imgUrl,
          usrDisplayName: usr.nickName,
          usrScore: usr.winnedMatchs[i].winnerScore,
          opScore: usr.winnedMatchs[i].looserScore,
          opDisplayName: usr.winnedMatchs[i].looser.nickName,
          opLogin: usr.winnedMatchs[i].looser.login,
          opAvatar: usr.winnedMatchs[i].looser.imgUrl,
        });
      }
      for (let i in usr.lostMatchs) {
        profile.matches.push({
          usrAvatar: usr.imgUrl,
          usrDisplayName: usr.nickName,
          usrScore: usr.lostMatchs[i].looserScore,
          opScore: usr.lostMatchs[i].winnerScore,
          opDisplayName: usr.lostMatchs[i].winner.nickName,
          opLogin: usr.lostMatchs[i].winner.login,
          opAvatar: usr.lostMatchs[i].winner.imgUrl,
        });
      }
      for (let i in usr.friends) {
        if (usr.friends[i].isAccepted == false) {
          profile.activities.push({
            avatar: usr.friends[i].requester.imgUrl,
            displayName: usr.friends[i].requester.nickName,
            createdAt: usr.friends[i].createdAt,
            message: 'sent you a friend request',
          });
        }
      }
    }
    return profile;
  } catch (error) {
    //console.log(error.message);
  }
}
