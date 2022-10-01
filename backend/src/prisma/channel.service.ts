import { INSTANCE_METADATA_SYMBOL } from "@nestjs/core/injector/instance-wrapper";
import { channelI } from "src/chat/model/channel.interface";
import { MessageI } from "src/chat/model/message.interface";
import { PrismaService } from "../prisma.service";

// export interface channelI {
//   // basic info
//   channelName: string;
//   isDirect: boolean; // à rajouter dans le schéma Prisma
//   isPrivate: boolean;
//   creator: string; // à rajouter dans le schéma Prisma
//   is_pwd: boolean;
//   pwd: string;
  
//   // advanced info
//   createdAt?: Date;
//   users?: string[];
//   userAdminList?: string[];
//   mutedUserList?: string[];
//   bannedUsers?: string[];
  
//   messages?: MessageI[];
//   // description?: string; // à rajouter par Juan
// }


export interface eventI {
  from: string;
  to: string;
  eventDate?: Date;
  eventDuration?: number;
}

export async function setChannel(this: PrismaService, channel: channelI, creatorId: string) {
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
    console.log(error.message);
  }
}

export async function setChannelMessage(this: PrismaService, id: string, channel_name: string, message: string) {
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

export async function setJoinChannel(this: PrismaService, userid: string, channel_name: string) {
  try {
    await this.prisma.joinChannel.create({
      data: {
        userId: userid,
        channelId: channel_name,
      },
    });
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function leaveChannel(this: PrismaService, userid: string, channel_name: string) {
  try {
    await this.prisma.joinChannel.delete({
      where: { 
        channelId_userId: {
          userId: userid,
          channelId: channel_name,
        }
      }
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

export async function deleteMuteUser(this: PrismaService, channel_name: string, login: string) {
  try {
    await this.prisma.muteUser.delete({
      where: {
        channelId_userId: {
          channelId: channel_name,
          userId: login,
        }
      }
    });
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function getMuteInfo(this: PrismaService, channel_name: string, login: string) {
  try {
    const mute = await this.prisma.muteUser.findUnique({
      where: {
        channelId_userId: {
          userId: login,
          channelId: channel_name,
        }
      },
      select: {
        createdAt: true,
        duration: true,
      },
    });
    let res: eventI = {
      from: login ; // à valider
      to: channel_name ; // à valider
      eventDate?: mute.createdAt ;
      eventDuration?: mute.duration ;
    };
    return res;
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function setBanUser(this: PrismaService, channel_name: string, login: string, duration: number) {
  try {
    await this.prisma.banUser.upsert({
      where: {
        channelId_userId: {
          userId: login,
          channelId: channel_name,
        }
      },
      update: { duration: duration },
      create: {
        userId: login,
        channelId: channel_name,
        duration: duration,
      },
    });
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function deleteBan(this: PrismaService, channel_name: string, login: string) {
  try {
    await this.prisma.banUser.delete({
      where: {
        channelId_userId: {
          userId: login,
          channelId: channel_name,
        }
      }
    });
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function isAdmin(this: PrismaService, channel_name: string, userId: string) {
  try {
    const channels = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {adminChannel: {select: {channelId: true}}}
    });
    for (let i in channels.adminChannel) {
      if (i == channel_name) {
        return true;
      }
    }
    return false;
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function isCreator(this: PrismaService, channel_name: string, userId: string) {
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

export async function removeChannelPass(this: PrismaService, channel_name: string) {
  try {
    await this.prisma.channel.update({
      where: { channelName: channel_name },
      data: { is_pwd: false, pwd: null },
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

export async function getPublicChannels(this: PrismaService) {
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
    console.log(error.message);
  }
}

export async function getchannelsForUser(this: PrismaService, userid: string, skip: number, take: number) {
  try {
    const channels = await this.prisma.user.findUnique({
      where: { id: userid },
      select: {
        channelList: {
          select: {
            channelId: true,
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
    return channels.channelList;
  }
  catch (error) {
    console.log(error.message);
  }
}

export async function getChannelInfo(this: PrismaService, channel_name: string): Promise<channelI> {
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
        creator: {
          select: {
            login: true,
          }
        },
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
    let res: channelI;
    res.bannedUsers = chan.bannedUsers.map((user) => user.userId);
    res.channelName = chan.channelName;
    res.createdAt = chan.createdAt;
    res.creator = chan.creator.login;
    res.is_pwd = chan.is_pwd;
    res.isPrivate = chan.isPrivate;
    res.isDirect = chan.isDirect;
    res.messages = chan.messages.map((message) => {
      let res: MessageI;
      res.createdAt = message.createdAt;
      res.user = message.from.login;
      res.text = message.message;
      res.channel = chan.channelName;
      return res;
    });

    return res;
  }
  catch (error) {
    console.log(error.message);
  }
}
