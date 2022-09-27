import { PrismaService } from "src/prisma.service";

export async function setChannel(this: PrismaService, name: string) {
  await this.prisma.channel.create({
    data: {
      channelName: name,
      isActive: true,
      is_pwd: false,
    },
  })
}

export async function sendChannelMessage(this: PrismaService,login: string, channel_name: string, message: string) {
  await this.prisma.channelMessage.create({
    data: {
      message: message,
      fromId: login,
      channelId: channel_name,
    },
  })
}

export async function setJoinChannel(this: PrismaService, login: string, channel_name: string) {
  await this.prisma.joinChannel.create({
    data: {
      userId: login,
      channelId: channel_name,
    },
  })
}

export async function setMuteUser(this: PrismaService, channel_name: string, login: string) {
    await this.prisma.muteUser.create({
      data: {
        channelId: channel_name,
        userId: login,
      },
    })
  }

export async function setMakeAdmin(this: PrismaService, login: string, channel_name: string) {
    await this.prisma.makeAdmin.create({
      data: {
        channelId: channel_name,
        userId: login,
      },
    })    
}

export async function setChannelPass(this: PrismaService, channel_name: string, pwd: string) {
    await this.prisma.channel.update({
      where: { channelName: channel_name },
      data: { is_pwd: true, pwd: pwd },
    })
}

export async function getChannelUsers(this: PrismaService, channel_name: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { channelName: channel_name },
      select: {
        userList: {
          select: { user: { select: {
            login: true,
            fullName: true,
            email: true,
            score: true,
            imgUrl: true,
            isOnline: true,
          }}}
        }
      }
    })
    return channel.userList;
}

export async function getChannel(this: PrismaService, channel_name: string) {
    const chan = await this.prisma.channel.findUnique({
      where: { channelName: channel_name },
      select: {
        channelName: true,
        createdAt: true,
        is_pwd: true,
        pwd: true,
        isActive: true,
        userList: {
            select: {
                userId: true,
            }
        },
        userAdminList: {
            select: {
                userId: true,
            }
        },
        mutedUserList: {
            select: {
                userId: true,
            }
        },
        bannedUsers: {
            select: {
                userId: true,
            }
        },
        messages: {
            select: {
                createdAt: true,
                message: true,
                fromId: true,
            }
        }
      }
    })
    return chan;
}