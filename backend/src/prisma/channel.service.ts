import { channelI } from "../chat/model/channel.interface";
import { PrismaService } from "../prisma.service";

// Hello Juan, 
// Tu trouveras dans ce fichier une nouvelle liste de services pour le chat, avec :
// (1) des petites modifications de fonctions lorsqu'il y a un prototype au-dessus d'une fonction
// (2) des nouvelles fonctions lorsqu'il y a un prototype tout seul
// N'hésite pas à me contacter directement si ce n'est pas clair,
// Merci beaucoup pour ton aide, Ulysse

// Modification souhaitée : lors de la création de la channel, le front va remplir la classe ChannelI, et il faudrait enregistrer toutes ces informations dans le back.
// export async function setChannel(this: PrismaService, channelI: channel) {
export async function setChannel(this: PrismaService, channel: channelI) {
  await this.prisma.channel.create({
    data: {
      channelName: channel.name,
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

// Nouvelle fonction souhaitée :
// export async function setLeaveChannel(this: PrismaService, login: string, channel_name: string) {}

// Modification souhaitée : sauvegarder aussi la date de mute et la durée du mute en seconde.
// export async function setMuteUser(this: PrismaService, channel_name: string, login: string, eventDate: Date, eventDuration: number) {
export async function setMuteUser(this: PrismaService, channel_name: string, login: string) {
    await this.prisma.muteUser.create({
      data: {
        channelId: channel_name,
        userId: login,
      },
    })
  }


// Nouvelle fonction souhaitée : unmute le user.
// export async function setUnmuteUser(this: PrismaService, channel_name: string, login: string) {}

// Nouvelle fonction souhaité : get mute info, qui retourne une structure eventI avec notamment la date et la durée du mute ;
// export async function getMuteInfo(this: PrismaService, channel_name: string, login: string) {}

// Nouvelle fonction souhaité : get ban info, qui retourne une structure eventI avec notamment la date et la durée du ban ;
// export async function getBanInfo(this: PrismaService, channel_name: string, login: string) {}

// Nouvelle fonction souhaitée : ban du user avec  la date de ban et la durée du ban en seconde.
// export async function setBanUser(this: PrismaService, channel_name: string, login: string, eventDate: Date, eventDuration: number) {
  
// Nouvelle fonction souhaitée : unban le user et le rajouter dans la l
// export async function setUnbanUser(this: PrismaService, channel_name: string, login: string) {}
  
// Nouvelle fonction souhaitée : une fonction qui vérifie si un user est admin d'un channel et retourne un booléen.
// export async function isAdmin(this: PrismaService, login: string, channel_name: string) {
// }

// Nouvelle fonction souhaitée : une fonction qui vérifie si un user est creator=owner d'un channel et retourne un booléen.
// export async function isCreator(this: PrismaService, login: string, channel_name: string) {
// }


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

// Nouvelle fonction ajouté : est-ce que c'est ok pour toi Juan ?
export async function removeChannelPass(this: PrismaService, channel_name: string) {
    await this.prisma.channel.update({
      where: { channelName: channel_name },
      data: { is_pwd: false, pwd: null },
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


// Nouvelle fonction souhaitée : une fonction qui renvoie un array de string contenant l'ensemble des Channels_names pour les channels publiques.
// export async function getPublicChannels() {}

// Nouvelle fonction souhaitée : une fonction à qui l'on donne un login, numéro de page et une limite et qui retourne un array de channel_name contenant les n = limit dernières channels mises à jour.
// export async function getchannelsForUser(this: PrismaService, login: string, { page: number, limit: number }) {}

// Nouvelle fonction souhaitée : une fonction qui save les messages dans la database
// export async function setMessage(this: PrismaService, message :MessageI){}

// rajouter getChannel qui renvoie les attribut de base, pas les listes

// renommer getChannelInfo, Modification souhaitée : Rajouter les nouveaux éléments suivants duschéma prisma : isDirect?: boolean; creator: string; 
// export async function getChannel(this: PrismaService, channel_name: string): Promise<channelI> {
//     const chan = await this.prisma.channel.findUnique({
//       where: { channelName: channel_name },
//       select: {
//         channelName: true,
//         createdAt: true,
//         is_pwd: true,
//         pwd: true,
//         isActive: true,
//         userList: {
//             select: {
//                 userId: true,
//             }
//         },
//         userAdminList: {
//             select: {
//                 userId: true,
//             }
//         },
//         mutedUserList: {
//             select: {
//                 userId: true,
//             }
//         },
//         bannedUsers: {
//             select: {
//                 userId: true,
//             }
//         },
//         messages: {
//             select: {
//                 createdAt: true,
//                 message: true,
//                 fromId: true,
//             }
//         }
//       }
//     })
//     return chan;
// }