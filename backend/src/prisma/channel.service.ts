import { PrismaService } from "../prisma.service";
import { IAccount, IChannel, eventI, IMessage } from "../interfaces";

export async function setChannel(this: PrismaService, channel: IChannel, creatorId: string) {
  try {
    await this.prisma.channel.create({
      data: {
        channelName: channel.channelName,
        creatorId: creatorId,
        isDirect: channel.isDirect,
        isPrivate: channel.isPrivate,
        is_pwd: false,
      },
    });
  }
  catch (error) {
    //console.log(error.message);
  }
}

export async function deleteChannel(this: PrismaService, channel: string) {
  try {
    await this.prisma.joinChannel.deleteMany({
      where: { channelId: channel }
    });
    await this.prisma.makeAdmin.deleteMany({ 
      where: { channelId: channel }
     });
    await this.prisma.banUser.deleteMany({
      where: { channelId: channel }
    });
    await this.prisma.muteUser.deleteMany({
      where: { channelId: channel }
    });
    await this.prisma.channelMessage.deleteMany({
      where: { channelId: channel }
    });
    await this.prisma.channel.delete({
      where: { channelName: channel }
    });
  }
  catch (error) {
    //console.log(error.message);
  }
}

export async function setChannelMessage(this: PrismaService, userId: string, channel_name: string, message: string, isNotif: boolean) {
  try {
    await this.prisma.channelMessage.create({
      data: {
        message: message,
        userId: userId,
        channelId: channel_name,
        isRead: false,
        isNotif: isNotif,
      },
    });
    await this.prisma.channel.update(
      {
        where:  {
          channelName: channel_name
        },
        data: {
          updatedAt: new Date(),
        }
      }
    )
  }
  catch (error) {
    //console.log(error.message);
  }
}

export async function setJoinChannel(this: PrismaService, login: string, channel_name: string) {
  try {
    await this.prisma.joinChannel.create({
      data: {
        login: login,
        channelId: channel_name,
      },
    });
  }
  catch (error) {
    //console.log(error.message);
  }
}

export async function leaveChannel(this: PrismaService, login: string, channel_name: string) {
  try {
    await this.prisma.joinChannel.delete({
      where: { 
        channelId_login: {
          login: login,
          channelId: channel_name,
        }
      }
    });
  }
  catch (error) {
    //console.log(error.message);
  }
}

export async function setMuteUser(this: PrismaService, channel_name: string, login: string, duration: number) {
  try {
    await this.prisma.muteUser.create({
      data: {
        channelId: channel_name,
        login: login,
        duration: duration,
      },
    });
  }
  catch (error) {
    //console.log(error.message);
  }
}

export async function deleteMuteUser(this: PrismaService, channel_name: string, login: string) {
  try {
    await this.prisma.muteUser.delete({
      where: {
        channelId_login: {
          channelId: channel_name,
          login: login,
        }
      }
    });
  }
  catch (error) {
    //console.log(error.message);
  }
}

export async function getMuteInfo(this: PrismaService, channel_name: string, login: string) {
  try {
    const mute = await this.prisma.muteUser.findUnique({
      where: {
        channelId_login: {
          login: login,
          channelId: channel_name,
        }
      },
      select: {
        createdAt: true,
        duration: true,
      },
    });
    let res : eventI  = {
      from: channel_name,
      to: login,
      eventDate: mute.createdAt,
      eventDuration: mute.duration,
    } 
    return res;
  }
  catch (error) {
    //console.log(error.message);
  }
}

export async function setBanUser(this: PrismaService, channel_name: string, login: string, duration: number) {
  try {
    await this.prisma.banUser.upsert({
      where: {
        channelId_login: {
          login: login,
          channelId: channel_name,
        }
      },
      update: { duration: duration },
      create: {
        login: login,
        channelId: channel_name,
        duration: duration,
      },
    });
  }
  catch (error) {
    //console.log(error.message);
  }
}

export async function deleteBan(this: PrismaService, channel_name: string, login: string) {
  try {
    await this.prisma.banUser.delete({
      where: {
        channelId_login: {
          login: login,
          channelId: channel_name,
        }
      }
    });
  }
  catch (error) {
    //console.log(error.message);
  }
}
export async function getBanInfo(this: PrismaService, channel_name: string, login: string) {
  try {
    const ban = await this.prisma.banUser.findUnique({
      where: {
        channelId_login: {
          login: login,
          channelId: channel_name,
        }
      },
      select: {
        createdAt: true,
        duration: true,
      },
    });
    let res : eventI  = {
      from: channel_name,
      to: login,
      eventDate: ban.createdAt,
      eventDuration: ban.duration,
    } 
    return res;
  }
  catch (error) {
    //console.log(error.message);
  }
}

//is admin plus vraiment necesaire
export async function isAdmin(this: PrismaService, login: string, channel_name: string): Promise<boolean> {
  try {
    const channels = await this.prisma.user.findUnique({
      where: { login: login },
      select: { adminChannel: {select: {channelId: true}}}
    });
    return channels.adminChannel.map((chan) => chan.channelId).includes(channel_name);
  }
  catch (error) {
    //console.log(error.message);
  }
}
// pareil plus vraiment necessaire
export async function isCreator(this: PrismaService, channel_name: string, userId: string): Promise<boolean> {
  try {
    const channel = await this.prisma.channel.findUnique({
      where: {
        channelName: channel_name
      },
      select: {
        creatorId: true,
      }
    });
    if (channel.creatorId == userId) {
      return true;
    }
    return false;
  }
  catch (error) {
    //console.log(error.message);
  }
}

export async function setMakeAdmin(this: PrismaService, login: string, channel_name: string) {
  try {
    await this.prisma.makeAdmin.create({
      data: {
        channelId: channel_name,
        login: login,
      },
    });
  }
  catch (error) {
    //console.log(error.message)
  }
}

export async function deleteMakeAdmin(this: PrismaService, login: string, channel_name: string) {
  try {
    await this.prisma.makeAdmin.delete({
      where: {
        channelId_login: {
          login: login,
          channelId: channel_name,
        }
      }
    });
  }
  catch (error) {
    //console.log(error.message);
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
    //console.log(error.message);
  }
}

export async function removeChannelPass(this: PrismaService, channel_name: string) {
  try {
    await this.prisma.channel.update({
      where: { channelName: channel_name },
      data: { is_pwd: false, pwd: null },
    });
  }
  catch (error) {
    //console.log(error.message);
  }
}

export async function getChannelUsers(this: PrismaService, channel_name: string): Promise<IAccount[]> {
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
    let list: IAccount[] = [];
    for (let i = 0; channel.userList[i]; i++) {
      list.push({
        login: channel.userList[i].user.login,
        nickName: channel.userList[i].user.nickName,
        email: channel.userList[i].user.email,
        score: channel.userList[i].user.score,
        avatar: channel.userList[i].user.imgUrl,
        isOnline: channel.userList[i].user.isOnline,
      });
    }
    return list;
  }
  catch (error) {
    //console.log(error.message);
  }
}

export async function getPublicChannels(this: PrismaService): Promise<IChannel[]> {
  try {
    const channels = await this.prisma.channel.findMany({
      where: {
        isPrivate: {
          equals: false,
        },
      },
      select: {
        channelName: true,
      }
    });
    return channels;
  }
  catch (error) {
    //console.log(error.message);
  }
}
export async function searchPublicChannels(this: PrismaService, key: string): Promise<IChannel[]> {
  try {
    const chans = await this.prisma.channel.findMany({
      where: {
        channelName: {
          contains: key,
          mode: 'insensitive',
        },
        isPrivate: false,
        isDirect: false,
      },
      select: {
        channelName: true,
      },
      take:
        30,
    });
    return chans;
  } catch (error) {
    //console.log(error.message);
  }
}

export async function getchannelsForUser(this: PrismaService, login: string, skip: number, take: number): Promise<IChannel[]> {
  try {
    const channels = await this.prisma.user.findUnique({
      where: { login: login },
      select: {
        channelList: {
          select: {
            channel: {
              select: {
                channelName: true,
                isDirect: true,
                userList: {
                  select: {
                    user: {
                      select: {
                        login: true,
                        nickName: true,
                        imgUrl: true,
                      }
                    }
                  }
                }
              }
            }
          },
          orderBy: {
            channel: {
              updatedAt: 'desc',
            }
          },
          skip: skip,
          take: take,
        },
      },
    });
    return channels.channelList.map((chan) => {
      return {
        ...chan.channel,
        users: chan.channel.userList.map((user) => {return {...user.user, avatar: user.user.imgUrl}}),
      }
    });
  }
  catch (error) {
    //console.log(error.message);
  }
}

export async function getChannelInfo(this: PrismaService, channel_name: string): Promise<IChannel> {
  try {
    const chan = await this.prisma.channel.findUnique({
      where: { channelName: channel_name },
      select: {
        channelName: true,
        createdAt: true,
        is_pwd: true,
        pwd: true,// pas ouf nan ? vaut mieux faire une fonction speciale ici pour check le password
        isPrivate: true,
        isDirect: true,
        creator: {
          select: {
            login: true,
          }
        },
        userList: {
          select: {
            user: {
              select: {
                login: true,
                imgUrl: true,
                nickName: true,
              }
            }
          }
        },
        userAdminList: {
            select: {
                login: true,
            }
        },
        mutedUserList: {
            select: {
                login: true,
            }
        },
        bannedUsers: {
            select: {
                login: true,
            }
        },
        // messages: {
        //     select: {
        //         createdAt: true,
        //         message: true,
        //         user: {select : {login: true}},
        //     }
        // }
      }
    });
    if (chan === null || chan === undefined) {
      return null;
    }
    let channel = {} as IChannel;
    channel = {
      channelName: chan.channelName,
      createdAt: chan.createdAt,
      is_pwd: chan.is_pwd,
      password: chan.pwd,
      isPrivate: chan.isPrivate,
      isDirect: chan.isDirect,
      creator: chan.creator.login,
      users: chan.userList.map((user) => { return {
        login: user.user.login,
        nickName: user.user.nickName,
        avatar: user.user.imgUrl
      }}),
      admins: chan.userAdminList,
      mutedUsers: chan.mutedUserList,
      bannedUsers: chan.bannedUsers,
      messages: [],
    }
    // for (let i in chan.messages) {
    //   channel.messages.push({
    //     createdAt: chan.messages[i].createdAt,
    //     message: chan.messages[i].message,
    //     from: chan.messages[i].user.login,
    //     channelId: channel_name,
    //   });
    // }
    return channel;
  }
  catch (error) {
    //console.log(error.message);
    return null;
  }
}

export async function getChannelMessages(this: PrismaService, channel_name: string): Promise<IMessage[]> {
  try {
    const messages = await this.prisma.channelMessage.findMany({
      where: { channelId: channel_name },
      select: {
        createdAt: true,
        message: true,
        user: {select : {login: true}},
        isNotif: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
      // take: 50,
    });
    return messages.map((mess) => {
      return {
        createdAt: mess.createdAt,
        message: mess.message,
        from: mess.user.login,
        channelId: channel_name,
        isNotif: mess.isNotif,
      }
    });
  }
  catch (error) {
    //console.log(error.message);
  }
}
