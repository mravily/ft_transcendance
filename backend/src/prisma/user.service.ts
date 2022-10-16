import { PrismaService } from '../prisma.service';
import { IAccount, IPhoto } from '../interfaces';

export async function setUser(
  this: PrismaService,
  login: string,
  nickname: string,
  firstname: string,
  lastname: string,
  email: string,
  imgUrl: string,
): Promise<string> {
  try {
    const user = await this.prisma.user.upsert({
      where: { login: login },
      update: {},
      create: {
        login: login,
        nickName: nickname,
        firstName: firstname,
        lastName: lastname,
        email: email,
        score: 0,
        twoFA: false,
        isSecret: false,
        isOnline: true,
        isAdmin: false,
        imgUrl: imgUrl,
        n_messages: 0,
      },
    });
    return user.id;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserLogin(this: PrismaService, userId: string): Promise<string> {
  try {
    const usr = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { login: true },
    });
    return usr.login;
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function updateUserAccount(this: PrismaService, userId: string, user: IAccount) {
  try {
    if (user.firstName !== undefined) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { firstName: user.firstName }
      });
    }
    if (user.lastName !== undefined) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { lastName: user.lastName }
      });
    }
    if (user.email !== undefined) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { email: user.email }
      });
    }
    if (user.nickName !== undefined) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { nickName: user.nickName }
      });
    }
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function setUserToken(this: PrismaService, userId: string, token: string) {
  try {
    await this.prisma.user.update({
      where: { id: userId },
      data: { token: token },
    });
  } catch (error) {
    console.log(error.message);
  }
}

export async function getUserToken(this: PrismaService, userId: string): Promise<IAccount> {
  try {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        login: true,
        token: true
      },
    });
    return user;
  } catch (error) {
    console.log(error.message);
  }
}

export async function get2FASecret(
  this: PrismaService,
  userId: string,
): Promise<IAccount> {
  try {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        secret: true,
        login: true,
        twoFA: true,
      },
    });
    return user;
  } catch (error) {
    console.log(error.message);
  }
}

export async function isUser(
  this: PrismaService,
  login: string,
): Promise<boolean> {
  try {
    const user = await this.prisma.user.count({
      where: { login: login },
    });
    if (user) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error.message);
  }
}

export async function getUserEmail(
  this: PrismaService,
  userId: string,
): Promise<string> {
  try {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    return user.email;
  } catch (error) {
    console.log(error.message);
  }
}

export async function setBlockUser(this: PrismaService, userId: string, login: string) {
  try {
    await this.prisma.blockUser.create({
      data: {
        blockerId: userId,
        blockedLogin: login,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
}

export async function deleteBlockUser(this: PrismaService, userId: string, login: string) {
  try {
    await this.prisma.blockUser.delete({
      where: {
        blockedLogin_blockerId: {
          blockedLogin: login,
          blockerId: userId,
        },
      },
    });
  } catch (error) {
    console.log(error.message);
  }
}

export async function sendFriendReq(this: PrismaService, requester: string, requested: string) {
  try {
    await this.prisma.addFriend.upsert({
      where: {
        requesterLogin_requestedLogin: {
          requestedLogin: requested,
          requesterLogin: requester,
        }
      },
      update: {},
      create: {
        requestedLogin: requested,
        requesterLogin: requester,
        isAccepted: false,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
}

export async function acceptFiendship(this: PrismaService, requersted: string, requester: string) {
  try {
    await this.prisma.addFriend.update({
      where: {
        requesterLogin_requestedLogin: {
          requestedLogin: requersted,
          requesterLogin: requester,
        }
      },
      data: { isAccepted: true },
    });
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function isSecret(this: PrismaService, userId: string): Promise<boolean> {
  try {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        isSecret: true,
      }
    });
    return user.isSecret;
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function set2FA(this: PrismaService, userId: string, secret: string, dataUrl: string) {
  try {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFA: true,
        isSecret: true,
        secret: secret,
        dataUrl: dataUrl
      },
    });
  } catch (error) {
    console.log(error.message);
  }
}

export async function delete2FA(this: PrismaService, userId: string) {
  try {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        twoFA : false,
        isSecret: false,
        secret: null,
        dataUrl: null
      },
    });
  } catch (error) {
    console.log(error.message);
  }
}

export async function is2FA(this: PrismaService, userId: string): Promise<boolean> {
  try {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFA: true },
    });
    return user.twoFA;
  } catch (error) {
    console.log(error.message);
  }
}

export async function get2FA(this: PrismaService, userId: string): Promise<IAccount> {
  try {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        login: true,
        twoFA: true,
        secret: true,
        dataUrl: true,
      },
    });
    return user;
  } catch (error) {
    console.log(error.message);
  }
}

export async function switch2FA(this: PrismaService, userId: string) {
  try {
    const usr = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFA: true },
    });

    if (usr.twoFA == true) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { twoFA: false },
      });
    } else {
      await this.prisma.user.update({
        where: { id: userId },
        data: { twoFA: true },
      });
    }
  } catch (error) {
    console.log(error.message);
  }
}

export async function updateUserScore(this: PrismaService, login: string, points: number) {
  try {
    await this.prisma.user.update({
      where: { login: login },
      data: { score: { increment: points } },
    });
  } catch (error) {
    console.log(error.message);
  }
}

export async function updateUserStatus(this: PrismaService, login: string, status: boolean) {
  try {
    await this.prisma.user.update({
      where: { id: login },
      data: { isOnline: status },
    });
  } catch (error) {
    console.log(error.message);
  }
}

export async function getBlockedUsers(this: PrismaService, login: string): Promise<IAccount[]> {
  try {
    const blockedList = await this.prisma.user.findUnique({
      where: { login: login },
      select: {
        blockedUsers: {
          select: {
            blocked: {
              select: {
                login: true,
                nickName: true,
                email: true,
                score: true,
                imgUrl: true,
                isOnline: true,
              },
            },
          },
        },
      },
    });
    const list: IAccount[] = [];
    for (let i = 0; blockedList.blockedUsers[i]; i++) {
      list[i] = blockedList.blockedUsers[i].blocked;
    }
    return list;
  } catch (error) {
    console.log(error.message);
  }
}

export async function uploadPhoto(this: PrismaService, userId: string, file: any) {
  try {
    await this.prisma.photos.create({
      data: {
        filename: file.filename,
        userId: userId,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
      },
    });
    const usr = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { login: true },
    });
    await this.prisma.user.update({
      where: { id: userId },
      data: { imgUrl: 'http://localhost:4200/api/stream/' + usr.login },
    });
  } catch (error) {
    console.log(error.message);
  }
}

export async function getLastPhoto(
  this: PrismaService,
  login: string,
): Promise<IPhoto> {
  try {
    const tmp = await this.prisma.user.findUnique({
      where: { login: login },
      select: {
        photo: {
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            filename: true,
            path: true,
            mimetype: true,
            size: true,
          },
        },
      },
    });
    return tmp.photo[0];
  } catch (error) {
    console.log(error.message);
  }
}

export async function getFriends(this: PrismaService, login: string): Promise<IAccount[]> {
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
              },
            },
          },
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
              },
            },
          },
        },
      },
    });
    const friendlist: IAccount[] = [];
    const a = 0;
    for (let i = 0; friends.friends[i]; i++) {
      friendlist.push(friends.friends[i].requested);
    }
    for (let i = 0; friends.befriend[i]; i++) {
      friendlist.push(friends.befriend[i].requester);
    }
    return friendlist;
  } catch (error) {
    console.log(error.message);
  }
}

export async function getFriendsById(
  this: PrismaService,
  userId: string,
): Promise<IAccount[]> {
  try {
    const friends = await this.prisma.user.findUnique({
      where: { id: userId },
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
              },
            },
          },
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
              },
            },
          },
        },
      },
    });
    const friendlist: IAccount[] = [];
    const a = 0;
    for (let i = 0; friends.friends[i]; i++) {
      friendlist.push(friends.friends[i].requested);
    }
    for (let i = 0; friends.befriend[i]; i++) {
      friendlist.push(friends.befriend[i].requester);
    }
    return friendlist;
  } catch (error) {
    console.log(error.message);
  }
}

export async function deleteUser(this: PrismaService, userId: string) {
  try {
    await this.prisma.photos.deleteMany({
      where: {user: {id: userId}}
    });
    await this.prisma.joinChannel.deleteMany({
      where: {user: {id: userId}}
    });
    await this.prisma.muteUser.deleteMany({
      where: {user: {id: userId}}
    });
    await this.prisma.makeAdmin.deleteMany({
      where: {user: {id: userId}}
    });
    await this.prisma.match.deleteMany({
      where: {
        OR: [
          { winner: {id: userId} },
          { looser: {id: userId} }
        ]
      }
    });
    await this.prisma.channelMessage.deleteMany({
      where: {user: {id: userId}}
    });
    await this.prisma.addFriend.deleteMany({
      where: {
        OR: [
          { requested: {id: userId} },
          { requester: {id: userId} }
        ]
      }
    });
    await this.prisma.blockUser.deleteMany({
      where: {
        OR: [
          { blocked: {id: userId} },
          { blocker: {id: userId} }
        ]
      }
    });
    await this.prisma.banUser.deleteMany({
      where: {user: {id: userId}}
    });
    const channels = await this.prisma.channel.findMany({
      where: { creatorId: userId },
      select: { channelName: true }
    });
    for (let i in channels) {
      await this.deleteChannel(channels[i].channelName);
    }
    await this.prisma.user.delete({
      where: {id: userId}
    });
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function getUserAccount(this: PrismaService, userId: string): Promise<IAccount> {
  try {
    const user = await this.prisma.user.findUnique({
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
          },
        },
        adminChannel: {
          select: {
            channelId: true,
          },
        },
        _count: {
          select: {
            winnedMatchs: true,
            lostMatchs: true,
          },
        },
        winnedMatchs: {
          select: {
            id: true,
            createdAt: true,
            winnerScore: true,
            looserScore: true,
            looserid: true,
          },
        },
        lostMatchs: {
          select: {
            id: true,
            createdAt: true,
            winnerScore: true,
            looserScore: true,
            winnerid: true,
          },
        },
        friends: {
          select: {
            requested: {
              select: {
                login: true,
                nickName: true,
                isOnline: true,
              },
            },
          },
        },
        befriend: {
          select: {
            requester: {
              select: {
                login: true,
                nickName: true,
                isOnline: true,
              },
            },
          },
        },
        blockedUsers: {
          select: {
            blockedLogin: true,
          },
        },
      },
    });
    const userAccount = {} as IAccount;
    if (user) {
      userAccount.firstName = user.firstName;
      userAccount.lastName = user.lastName;
      userAccount.nickName = user.nickName;
      userAccount.email = user.email;
      userAccount.login = user.login;
      userAccount.avatar = user.imgUrl;
      userAccount.winnedMatch = user.winnedMatchs;
      userAccount.lostMatch = user.lostMatchs;
      userAccount.win = user._count.winnedMatchs;
      userAccount.lost = user._count.lostMatchs;
      for (let i = 0; user.befriend[i]; i++) {
        userAccount.friends.push(user.friends[i].requested);
      }
      for (let i = 0; user.blockedUsers[i]; i++) {
        userAccount.blockUsers.push(user.blockedUsers[i].blockedLogin);
      }
      for (let i = 0; user.befriend[i]; i++) {
        userAccount.friends.push(user.befriend[i].requester);
      }
      userAccount.createdAt = user.createdAt;
      userAccount.twoFA = user.twoFA;
      userAccount.isAdmin = user.isAdmin;
      for (const i in user.channelList) {
        userAccount.channelList.push(i);
      }
      for (const i in user.adminChannel) {
        userAccount.channelAdmin.push(i);
      }
    }
    return userAccount;
  } catch (error) {
    console.log(error.message);
  }
}
