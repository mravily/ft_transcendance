import { PrismaService } from "../prisma.service";

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
    try {
      const user = await this.prisma.user.upsert({
          where: { login: login },
          update: { atoken: atoken, rtoken: rtoken },
          create: {
              login: login,
              nickName: name,
              firstName: firstname,
              lastName: lastname,
              email: email,
              score: 0,
              atoken: atoken,
              rtoken: rtoken,
              twoFA: false,
              isOnline: true,
              isAdmin: isAdmin,
              imgUrl: imgUrl,
              n_messages: 0,
          }
      });
      return (user.id);
    }
    catch (error) {
      console.log(error);
    }
}

export async function setBlockUser(this: PrismaService, login: string, block_login: string) {
  try {
    await this.prisma.blockUser.create({
        data: {
            blockerId: login,
            blockedId: block_login,
        }
    });
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function deleteBlockUser(this: PrismaService, userId: string, login: string) {
  try {
    await this.prisma.blockUser.delete({
      where: {
        blockedId_blockerId: {
          blockedId: login,
          blockerId: userId,
        }
      }
    });
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function sendFriendReq(this: PrismaService, requester: string, requested: string) {
  try {
    await this.prisma.addFriend.create({
        data: {
            requestedId: requested,
            requesterId: requester,
            isAccepted: false,
        },
        // include: {requesterId: true, requestedId: true}
    });
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function set2FA(this: PrismaService, userId: string, twoFA: string) {
  try {
    await this.prisma.user.update({
        where: { id: userId },
        data: { twoFA: true, twoFApwd: twoFA },
    })
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function delete2FA(this: PrismaService, userId: string) {
  try {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {twoFA: false, twoFApwd: null}
    });
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function updateUserScore(this: PrismaService,login: string, points: number) {
  try {
    await this.prisma.user.update({
        where: {login: login},
        data: {score:{increment: points}},
    })
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function updateUserStatus(this: PrismaService,login: string, status: boolean) {
  try {
    await this.prisma.user.update({
        where: { login: login },
        data: { isOnline: status },
    })
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function getBlockedUsers(this: PrismaService,login: string) {
  try {
    const blockedList = await this.prisma.user.findUnique({
        where: { login: login },
        select: { blockedUsers: {
            select: {
                blocked: {
                    select: {
                        login: true,
                        nickName: true,
                        email: true,
                        score: true,
                        imgUrl: true,
                        isOnline: true,
                    }
                }
            }
        }},
    });
    let list;
    for (let i = 0; blockedList.blockedUsers[i]; i++) {
      list[i] = blockedList.blockedUsers[i];
    }
    return list;
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function getUser(this: PrismaService, login: string) {
  try {
    const usr = await this.prisma.user.findUnique({where:{login:login}});
    return usr;
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function uploadPhoto(this: PrismaService, userId: string, filename:string, path: string) {
  try {
    await this.photos.create({
      data: {filename: filename, userId: userId, path: path},
    });
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function getFriends(this: PrismaService, login: string) {
  try {
    const friends = await this.prisma.user.findUnique({
        where: { login: login },
        select: { 
          friends: {
            select: {
              requested: {
                select: {
                  login: true,
                  nickName: true,
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
              requester: {
                select: {
                  login: true,
                  nickName: true,
                  email: true,
                  score: true,
                  imgUrl: true,
                  isOnline: true,
                }
              },
            }
          },
        }
      });
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
  catch (error) {
    console.log(error.message);
  }
}

export async function getFriendsById(this: PrismaService, id: string) {
  try {
    const friends = await this.prisma.user.findUnique({
        where: { id: id },
        select: { 
          friends: {
            select: {
              requested: {
                select: {
                  login: true,
                  nickName: true,
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
              requester: {
                select: {
                  login: true,
                  nickName: true,
                  email: true,
                  score: true,
                  imgUrl: true,
                  isOnline: true,
                }
              },
            }
          },
        }
      });
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
  catch (error) {
    console.log(error.message);
  }
}

export async function getLastPhotoPath(this: PrismaService, id: string) {
  try {
    const tmp = await this.prisma.user.findUnique({
      where: { id: id },
      select: {
        photo: {
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            path: true
          }
        },
      },
    });
    return tmp.photo[0].path;
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function getUserAccount(this: PrismaService, userId: string) {
  try {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      select: {
        login: true,
        createdAt: true,
        nickName: true,
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
            requested: {
              select: {
                login: true,
                nickName: true,
                isOnline: true,
              }
            },
          }
        },
        befriend: {
          select: {
            requester: {
              select: {
                login: true,
                nickName: true,
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
    });
    let userAccount = {} as IAccount;
    if (user) {
      userAccount.firstName = user.firstName;
      userAccount.lastName = user.lastName;
      userAccount.fullName = user.nickName;
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
        userAccount.friends.push(user.friends[i].requested);
      }
      for (let i = 0; user.blockedUsers[i]; i++) {
        userAccount.blockUsers.push(user.blockedUsers[i].blockedId);
      }
      for (let i = 0; user.befriend[i]; i++) {
        userAccount.beFriends.push(user.befriend[i].requester);
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
  catch (error) {
    console.log(error.message);
  }
}