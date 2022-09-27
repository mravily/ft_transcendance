import { PrismaService } from "src/prisma.service";

export interface IAccount {
  firstName: string,
  lastName: string,
  fullName: string,
  email: string,
  login: string,
  imgUrl: string,
  win?: number,
  lost?: number,
  winnedMatch?: any[],
  lostMatch?: any[],
  friends?: any[],
  blockUsers?: any[],
  beFriends?: any[],
  createdAt?: Date,
  twoFA?: boolean,
  isAdmin?: boolean,
  channelList?: any[],
  channelAdmin?: any[],
}

export async function setUser(
    this: PrismaService,
    login: string,
    name: string,
    firstname: string,
    lastname: string,
    email: string,
    isAdmin: boolean,
    rtoken: string,
    atoken: string,
    imgUrl: string) {
    await this.prisma.user.upsert({
        where: { login: login },
        update: { atoken: atoken, rtoken: rtoken },
        create: {
            login: login,
            fullName: name,
            firstName: firstname,
            lastName: lastname,
            email: email,
            score: 0,
            atoken: atoken,
            rtoken: rtoken,
            twoFA: false,
            isOnline: true,
            isAdmin: isAdmin,
            imgUrl: imgUrl
        }
    })
}

export async function setBlockUser(this: PrismaService, login: string, block_login: string) {
    await this.prisma.blockUser.create({
        data: {
            blockerId: login,
            blockedId: block_login,
        }
    })
}

export async function setFriend(this: PrismaService, login1: string, login2: string) {
    await this.prisma.addFriend.create({
        data: {
            friend1Id: login1,
            friend2Id: login2,
        },
        include: {friend1: true, friend2: true}
    })
}

export async function set2FA(this: PrismaService,login: string, twoFA: string) {
    await this.prisma.user.update({
        where: { login: login },
        data: { twoFA: true, twoFApwd: twoFA },
    })
}

export async function updateUserScore(this: PrismaService,login: string, score: number) {
    await this.prisma.user.update({
        where: {login: login},
        data: {score: score},
    })
}

export async function updateUserStatus(this: PrismaService,login: string, status: boolean) {
    await this.prisma.user.update({
        where: { login: login },
        data: { isOnline: status },
    })
}

export async function getBlockedUsers(this: PrismaService,login: string) {
    const blockedList = await this.prisma.user.findUnique({
        where: { login: login },
        select: { blockedUsers: {
            select: {
                blocked: {
                    select: {
                        login: true,
                        fullName: true,
                        email: true,
                        score: true,
                        imgUrl: true,
                        isOnline: true,
                    }
                }
            }
        }},
    })
    let list;
    for (let i = 0; blockedList.blockedUsers[i]; i++) {
        list[i] = blockedList.blockedUsers[i];
  }
  return list;
}

export async function getUser(this: PrismaService, login: string) {
    const usr = await this.prisma.user.findUnique({
        where: {login: login}
        })
    return usr;
}

export async function uploadPhoto(this: PrismaService, login: string, filename:string) {
  await this.photos.upsert({
    where: {userId: login},
    update: {filename: filename},
    create: {filename: filename, userId: login}
  })
}

export async function getFriends(this: PrismaService, login: string) {
    const friends = await this.prisma.user.findUnique({
        where: { login: login },
        select: { 
          friends: {
            select: {
              friend1: {
                select: {
                  login: true,
                  fullName: true,
                  email: true,
                  score: true,
                  imgUrl: true,
                  isOnline: true,
                }
              },
            }
          },
          befriend: {
            select: {
              friend2: {
                select: {
                  login: true,
                  fullName: true,
                  email: true,
                  score: true,
                  imgUrl: true,
                  isOnline: true,
                }
              },
            }
          },
        }
      })
    let friendlist;
    let a = 0;
    for (let i = 0; friends.friends[i] ; i++) {
      friendlist[a++] = friends.friends[i];
    }
    for (let i = 0; friends.befriend[i] ; i++) {
      friendlist[a++] = friends.befriend[i];
    }
    return friendlist;
}

export async function getPhotoPath(this: PrismaService, login: string) {
  const tmp = await this.prisma.user.findUnique({
    where: { login: login },
    select: { photo: { select : { filename: true } } }
  });
  return tmp.photo.filename;
}

export async function getUserAccount(this: PrismaService, login: string) {
    const user = await this.prisma.user.findFirst({
      where: { login: login },
      select: {
        login: true,
        createdAt: true,
        fullName: true,
        firstName: true,
        lastName: true,
        email: true,
        score: true,
        imgUrl: true,
        twoFA: true,  
        isAdmin: true,
        channelList: {
          select: {
            channelId: true,
          }
        },
        adminChannel: {
          select: {
            channelId: true,
          }
        },
        winnedMatchs: {
          select: {
            id: true,
            createdAt: true,
            winnerScore: true,
            looserScore: true,
            looserid: true,
          }
        },
        lostMatchs: {
          select: {
            id: true,
            createdAt: true,
            winnerScore: true,
            looserScore: true,
            winnerid: true,
          }
        },
        friends: {
          select: {
            friend1: {
              select: {
                login: true,
                fullName: true,
                isOnline: true,
              }
            },
          }
        },
        befriend: {
          select: {
            friend2: {
              select: {
                login: true,
                fullName: true,
                isOnline: true,
              }
            }
          }
        },
        blockedUsers: {
          select: {
            blockedId: true,
          }
        },
      }
    })
    let userAccount = {} as IAccount;
    if (user) {
      userAccount.firstName = user.firstName;
      userAccount.lastName = user.lastName;
      userAccount.fullName = user.fullName;
      userAccount.email = user.email;
      userAccount.login = user.login;
      userAccount.imgUrl = user.imgUrl;
      userAccount.winnedMatch = user.winnedMatchs;
      userAccount.lostMatch = user.lostMatchs;
      userAccount.win = 0;
      for (let i = 0; user.winnedMatchs[i]; i++) {
        userAccount.win++;
      }
      userAccount.lost = 0;
      for (let i = 0; user.lostMatchs[i]; i++) {
        userAccount.lost++;
      }
      for (let i = 0; user.befriend[i]; i++) {
        userAccount.friends.push(user.friends[i].friend1);
      }
      for (let i = 0; user.blockedUsers[i]; i++) {
        userAccount.blockUsers.push(user.blockedUsers[i].blockedId);
      }
      for (let i = 0; user.befriend[i]; i++) {
        userAccount.beFriends.push(user.befriend[i].friend2);
      }
      userAccount.createdAt = user.createdAt;
      userAccount.twoFA = user.twoFA;
      userAccount.isAdmin = user.isAdmin;
      for (let i in user.channelList) {
        userAccount.channelList.push(i);
      }
      for (let i in user.adminChannel) {
        userAccount.channelAdmin.push(i);
      }
    }
    return userAccount;
}