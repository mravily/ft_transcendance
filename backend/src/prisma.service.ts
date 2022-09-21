import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { ChannelStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface accountUser {
  score: number;
  login: string;
  name: string;
  email: string;
  photo: string;
  online: boolean;
  win: number;
  lost: number;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async setUser(
    login: string,
    name: string,
    email: string,
    isAdmin: boolean,
    rtoken: string,
    atoken: string,
    photo: string,
  ) {
    await prisma.user.upsert({
      where: { login: login },
      update: { atoken: atoken, rtoken: rtoken },
      create: {
        login: login,
        name: name,
        email: email,
        level: 0.0,
        score: 0,
        atoken: atoken,
        rtoken: rtoken,
        twoFA: false,
        isOnline: true,
        isAdmin: isAdmin,
        photo: photo,
      },
    });
  }

  async setChannel(name: string) {
    await prisma.channel.create({
      data: {
        channelName: name,
        status: ChannelStatus.Active,
        is_pwd: false,
      },
    });
  }

  async setMatch(
    w_score: number,
    l_score: number,
    w_login: string,
    l_login: string,
  ) {
    await prisma.match.create({
      data: {
        winnerScore: w_score,
        looserScore: l_score,
        winnerid: w_login,
        looserid: l_login,
      },
    });
  }

  async setFriend(login1: string, login2: string) {
    await prisma.addFriend.create({
      data: {
        friend1Id: login1,
        friend2Id: login2,
      },
      include: { friend1: true, friend2: true },
    });
  }

  async setBlockUser(login: string, block_login: string) {
    await prisma.blockUser.create({
      data: {
        blockerId: login,
        blockedId: block_login,
      },
    });
  }

  async sendPrivMessage(login_from: string, login_to: string, message: string) {
    await prisma.privMessage.create({
      data: {
        message: message,
        fromId: login_from,
        toId: login_to,
      },
    });
  }

  async sendChannelMessage(
    login: string,
    channel_name: string,
    message: string,
  ) {
    await prisma.channelMessage.create({
      data: {
        message: message,
        fromId: login,
        channelId: channel_name,
      },
    });
  }

  async setJoinChannel(login: string, channel_name: string) {
    await prisma.joinChannel.create({
      data: {
        userId: login,
        channelId: channel_name,
      },
    });
  }

  async setMuteUser(channel_name: string, login: string) {
    await prisma.muteUser.create({
      data: {
        channelId: channel_name,
        userId: login,
      },
    });
  }

  async setMakeAdmin(login: string, channel_name: string) {
    await prisma.makeAdmin.create({
      data: {
        channelId: channel_name,
        userId: login,
      },
    });
  }

  async set2FA(login: string, twoFA: string) {
    await prisma.user.update({
      where: { login: login },
      data: { twoFA: true, twoFApwd: twoFA },
    });
  }

  async setChannelPass(channel_name: string, pwd: string) {
    await prisma.channel.update({
      where: { channelName: channel_name },
      data: { is_pwd: true, pwd: pwd },
    });
  }

  async updateUserScore(login: string, score: number) {
    await prisma.user.update({
      where: { login: login },
      data: { score: score },
    });
  }

  async updateUserStatus(login: string, status: boolean) {
    await prisma.user.update({
      where: { login: login },
      data: { isOnline: status },
    });
  }

  async getBlockedUsers(login: string) {
    const blockedList = await prisma.user.findUnique({
      where: { login: login },
      select: {
        blockedUsers: {
          select: {
            blocked: {
              select: {
                login: true,
                name: true,
                email: true,
                level: true,
                score: true,
                photo: true,
                isOnline: true,
              },
            },
          },
        },
      },
    });
    let list;
    for (let i = 0; blockedList.blockedUsers[i]; i++) {
      list[i] = blockedList.blockedUsers[i];
    }
    return list;
  }

  async getFriends(login: string) {
    const friends = await prisma.user.findUnique({
      where: { login: login },
      select: {
        friends: {
          select: {
            friend1: {
              select: {
                login: true,
                name: true,
                email: true,
                level: true,
                score: true,
                photo: true,
                isOnline: true,
              },
            },
          },
        },
        befriend: {
          select: {
            friend2: {
              select: {
                login: true,
                name: true,
                email: true,
                level: true,
                score: true,
                photo: true,
                isOnline: true,
              },
            },
          },
        },
      },
    });
    let friendlist;
    let a = 0;
    for (let i = 0; friends.friends[i]; i++) {
      friendlist[a++] = friends.friends[i];
    }
    for (let i = 0; friends.befriend[i]; i++) {
      friendlist[a++] = friends.befriend[i];
    }
    return friendlist;
  }

  async getUser(login: string) {
    const usr = await prisma.user.findUnique({
      where: { login: login },
    });
    return usr;
  }

  async getChannel(channel_name: string) {
    const chan = await prisma.channel.findUnique({
      where: { channelName: channel_name },
    });
    return chan;
  }

  async getTopTen() {
    const list = await prisma.user.findMany({
      select: {
        email: true,
        login: true,
        name: true,
        photo: true,
        score: true,
        isOnline: true,
      },
      orderBy: { score: 'desc' },
      take: 10,
    });
    const users: accountUser[] = [];
    for (const i in list) {
      const user: accountUser = {
        score: list[i].score,
        login: list[i].login,
        name: list[i].name,
        email: list[i].email,
        photo: list[i].photo,
        online: list[i].isOnline,
        win: await this.getNoWinnedMatchs(list[i].login),
        lost: await this.getNolostMatchs(list[i].login),
      };
      users.push(user);
    }
    return users;
  }

  async getNoWinnedMatchs(login: string) {
    return await prisma.match.count({
      where: { winnerid: login },
    });
  }

  async getNolostMatchs(login: string) {
    return await prisma.match.count({
      where: { looserid: login },
    });
  }

  async getMatchHistory(login: string) {
    const list = await prisma.user.findUnique({
      where: { login: login },
      select: {
        winnedMatchs: { orderBy: { createdAt: 'desc' } },
        lostMatchs: { orderBy: { createdAt: 'desc' } },
      },
    });
    return list.lostMatchs.concat(list.winnedMatchs).sort((a, b) => {
      if (a.createdAt < b.createdAt) return -1;
      else if (a.createdAt > b.createdAt) return 1;
      return 0;
    });
  }

  async getRatio(login: string) {
    const wins = await prisma.match.count({
      where: { winnerid: login },
    });
    const lost = await prisma.match.count({
      where: { looserid: login },
    });
    return [wins, lost];
  }

  async getChannelUsers(channel_name: string) {
    const channel = await prisma.channel.findUnique({
      where: { channelName: channel_name },
      select: {
        userList: {
          select: {
            user: {
              select: {
                login: true,
                name: true,
                email: true,
                level: true,
                score: true,
                photo: true,
                isOnline: true,
              },
            },
          },
        },
      },
    });
    return channel.userList;
  }

  async getUserAccount(login: string) {
    const user = await prisma.user.findFirst({
      where: { login: login },
      select: {
        login: true,
        createdAt: true,
        name: true,
        email: true,
        level: true,
        score: true,
        photo: true,
        twoFA: true,
        isOnline: true,
        isAdmin: true,
        channelList: {
          select: {
            channelId: true,
          },
        },
        mutedChannel: {
          select: {
            channelId: true,
          },
        },
        adminChannel: {
          select: {
            channelId: true,
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
            friend1: {
              select: {
                login: true,
                name: true,
                isOnline: true,
              },
            },
          },
        },
        befriend: {
          select: {
            friend2: {
              select: {
                login: true,
                name: true,
                isOnline: true,
              },
            },
          },
        },
        blockedUsers: {
          select: {
            blockedId: true,
          },
        },
        blockedFrom: {
          select: {
            blockerId: true,
          },
        },
        bannedFrom: {
          select: {
            channelId: true,
          },
        },
      },
    });
  }
}
