import { PrismaService } from "../prisma.service";

export async function setChannel(this: PrismaService, name: string, creator: string, isDirect: boolean, isPrivate: boolean) {
  try {
    await this.prisma.channel.create({
      data: {
        channelName: name,
        creatorId: creator,
        isDirect: isDirect,
        isPrivate: isPrivate,
        is_pwd: false,
      },
    });
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function sendChannelMessage(this: PrismaService,id: string, channel_name: string, message: string) {
  try {
    await this.prisma.channelMessage.create({
      data: {
        message: message,
        fromId: id,
        channelId: channel_name,
        isRead: false,
      },
    });
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function setJoinChannel(this: PrismaService, login: string, channel_name: string) {
  try {
    await this.prisma.joinChannel.create({
      data: {
        userId: login,
        channelId: channel_name,
      },
    });
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function setMuteUser(this: PrismaService, channel_name: string, login: string, duration: number) {
  try {
    await this.prisma.muteUser.create({
      data: {
        channelId: channel_name,
        userId: login,
        duration: duration,
      },
    });
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function setMakeAdmin(this: PrismaService, login: string, channel_name: string) {
  try {
    await this.prisma.makeAdmin.create({
      data: {
        channelId: channel_name,
        userId: login,
      },
    });
  }
  catch (error) {
    console.log(error.message)
  }
}

export async function setChannelPass(this: PrismaService, channel_name: string, pwd: string) {
  try {
    await this.prisma.channel.update({
      where: { channelName: channel_name },
      data: { is_pwd: true, pwd: pwd },
    });
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function getChannelUsers(this: PrismaService, channel_name: string) {
  try {
    const channel = await this.prisma.channel.findUnique({
      where: { channelName: channel_name },
      select: {
        userList: {
          select: { user: { select: {
            login: true,
            nickName: true,
            email: true,
            score: true,
            imgUrl: true,
            isOnline: true,
          }}}
        }
      }
    });
    return channel.userList;
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function getChannel(this: PrismaService, channel_name: string) {
  try {
    const chan = await this.prisma.channel.findUnique({
      where: { channelName: channel_name },
      select: {
        channelName: true,
        createdAt: true,
        is_pwd: true,
        pwd: true,
        isPrivate: true,
        isDirect: true,
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
                from: {select : {login: true}},
            }
        }
      }
    });
    return chan;
  }
  catch (error) {
    console.log(error.message);
  }
}