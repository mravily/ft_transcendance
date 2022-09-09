import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import {
  ChannelStatus,
  PrismaClient,
  UserRole,
  UserStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

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
    role: UserRole,
    token: string,
  ) {
    await prisma.user.create({
      data: {
        login: login,
        name: name,
        email: email,
        level: 0.0,
        score: 0,
        token: token,
        twoFA: false,
        status: UserStatus.OnLine,
        role: role,
      },
    });
  }

  async setChannel(name: string) {
    await prisma.channel.create({
      data: {
        channelName: name,
        status: ChannelStatus.Active,
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
      data: { pwd: pwd },
    });
  }

  async updateUserScore(login: string, score: number) {
    await prisma.user.update({
      where: { login: login },
      data: { score: score },
    });
  }

  async updateUserStatus(login: string, status: UserStatus) {
    await prisma.user.update({
      where: { login: login },
      data: { status: status },
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
                status: true,
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
                status: true,
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
                status: true,
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
}
