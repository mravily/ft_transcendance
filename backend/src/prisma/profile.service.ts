import { PrismaService } from '../prisma.service';
import { IAccount, IPersoMatch } from '../interfaces';

export interface IProfileFriends {
    nickName: string,
    login: string,
    win: number,
    lost: number,
    isOnline: boolean,
    isAccepted: boolean,
    score: number,
    avatar: string,
    isSent: boolean,
    rank: number,
}

export async function getProfileFriends(this: PrismaService, userId: string): Promise<IProfileFriends[]> {
  try {
    const list = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        friends: {
          select: {
            isAccepted: true,
            requester: {
              select: {
                nickName: true,
                login: true,
                score: true,
                isOnline: true,
                imgUrl: true,
                _count: {
                  select: {
                    lostMatchs: true,
                    winnedMatchs: true,
                  }
                }
              }
            }
          },
          orderBy: { requester: { score: 'desc' } }
        },
        befriend: {
          select: {
            isAccepted: true,
            requested: {
              select: {
                nickName: true,
                login: true,
                score: true,
                isOnline: true,
                imgUrl: true,
                _count: {
                  select: {
                    lostMatchs: true,
                    winnedMatchs: true,
                  }
                }
              }
            }
          },
          orderBy: { requested: { score: 'desc' } }
        },
      }
    });
    let friends: IProfileFriends[] = [];
    if (list) {
      for (let i in list.befriend) {
        if (await this.isBlocked(userId, list.befriend[i].requested.login) == false) {
          friends.push({
              nickName:list.befriend[i].requested.nickName,
              login: list.befriend[i].requested.login,
              win: list.befriend[i].requested._count.winnedMatchs,
              lost: list.befriend[i].requested._count.lostMatchs,
              isOnline: list.befriend[i].requested.isOnline,
              isAccepted: list.befriend[i].isAccepted,
              score: list.befriend[i].requested.score,
              avatar: list.befriend[i].requested.imgUrl,
              isSent: true,
              rank: await this.getUserRank(list.befriend[i].requested.login),
          });
        }
      }
      for (let i in list.friends) {
        if (await this.isBlocked(userId, list.friends[i].requester.login) == false) {
          friends.push({
              nickName:list.friends[i].requester.nickName,
              login: list.friends[i].requester.login,
              win: list.friends[i].requester._count.winnedMatchs,
              lost: list.friends[i].requester._count.lostMatchs,
              isOnline: list.friends[i].requester.isOnline,
              isAccepted: list.friends[i].isAccepted,
              score: list.friends[i].requester.score,
              avatar: list.friends[i].requester.imgUrl,
              isSent: false,
              rank: await this.getUserRank(list.friends[i].requester.login),
          });
        }
      }
    }
    return friends.sort((a, b) => (a.score > b.score ? -1 : 1));
  }
  catch (error) {
    //console.log(error.message);
  }
}

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
        profile = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          login: user.login,
          nickName: user.nickName,
          avatar: user.imgUrl,
        }
      }
      return profile;
  }
  catch (error) {}
}

export async function getUserRank(this: PrismaService, login: string): Promise<number> {
  try {
    const rank = await this.prisma.user.findMany({
      select: { login: true },
      orderBy: {score: 'desc'}
    });
    for (let i = 0; rank[i]; i++) {
      if (rank[i].login == login) {
        return (i + 1);
      }
    }
    return 0;
  }
  catch (error) {
    //console.log(error.message);
  }
}

export async function getPublicProfile(this: PrismaService, login: string): Promise<IAccount> {
  try {
    const user = await this.prisma.user.findUnique({
      where : { login: login },
      select: {
        login: true,
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
      profile = {
        login: user.login,
        friends: [],
        matches: [],
        n_friends: 0,
        rank: await this.getUserRank(login),
        lost: user._count.lostMatchs,
        win: user._count.winnedMatchs,
        avatar: user.imgUrl,
      }
      for (let i = 0; user.befriend[i]; i++) {
        if (user.befriend[i].isAccepted == true) {
          profile.friends.push({
            avatar: user.befriend[i].requested.imgUrl,
            nickName: user.befriend[i].requested.nickName,
            login: user.befriend[i].requested.login,
          });
          profile.n_friends++;
        }
      }
      for (let i = 0; user.friends[i]; i++) {
        if (user.friends[i].isAccepted == true) {
          profile.friends.push({
            avatar: user.friends[i].requester.imgUrl,
            nickName: user.friends[i].requester.nickName,
            login: user.friends[i].requester.login,
          });
          profile.n_friends++;
        }
      }
      for (let i = 0; user.winnedMatchs[i]; i++) {
        profile.matches.push({
          opDisplayName: user.winnedMatchs[i].looser.nickName,
          opLogin: user.winnedMatchs[i].looser.login,
          opScore: user.winnedMatchs[i].looserScore,
          opAvatar: user.winnedMatchs[i].looser.imgUrl,
          usrAvatar: user.imgUrl,
          usrDisplayName: user.nickName,
          usrScore: user.winnedMatchs[i].winnerScore,
        });
      }
      for (let i = 0; user.lostMatchs[i]; i++) {
        profile.matches.push({
          opDisplayName: user.lostMatchs[i].winner.nickName,
          opLogin: user.lostMatchs[i].winner.login,
          opScore: user.lostMatchs[i].winnerScore,
          opAvatar: user.lostMatchs[i].winner.imgUrl,
          usrAvatar: user.imgUrl,
          usrDisplayName: user.nickName,
          usrScore: user.lostMatchs[i].looserScore,
        });
      }
    }
    return profile;
  }
  catch (error) {
    //console.log(error.message);
  }
}