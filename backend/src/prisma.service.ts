
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { getTopTen, getUsersRanking } from './prisma/leaderboard.service';
import { setUser, getUserAccount, set2FA, updateUserScore, updateUserStatus, getBlockedUsers, getFriends, getUser, getUserById, uploadPhoto, sendFriendReq, getLastPhotoPath, deleteBlockUser, setBlockUser } from './prisma/user.service';
import { deleteBan, deleteMuteUser, getChannelInfo, getchannelsForUser, getChannelUsers, getMuteInfo,  getBanInfo, getPublicChannels, isAdmin, isCreator, leaveChannel, getMessagesForChannel, removeChannelPass, setBanUser, setChannel, setChannelMessage, setChannelPass, setJoinChannel, setMakeAdmin, setMuteUser } from './prisma/channel.service';
import { getMatchHistory, getNolostMatchs, getNoWinnedMatchs, getRatio, setMatch } from './prisma/match.service';
import { getSidebar } from './prisma/sidebar.service';
import { channelI } from './chat/model/channel.interface';
import { MessageI } from './chat/model/message.interface';
import { PageI } from './chat/model/page.interface';


export interface accountUser {
  score: number,
  login: string,
  name: string,
  email: string,
  photo: string,
  online: boolean,
  win: number,
  lost: number,
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
  
  protected prisma = new PrismaClient();

  public getTopTen = getTopTen;
  public setUser = setUser;
  public getUserAccount = getUserAccount;
  public setChannel = setChannel;
  public sendFriendReq = sendFriendReq;
  public setMatch = setMatch;
  public setChannelMessage = setChannelMessage;
  public setJoinChannel = setJoinChannel;
  public setMuteUser = setMuteUser;
  public setMakeAdmin = setMakeAdmin;
  public set2FA = set2FA;
  public setChannelPass = setChannelPass;
  public updateUserScore = updateUserScore;
  public updateUserStatus = updateUserStatus;
  public getBlockedUsers = getBlockedUsers;
  public getFriends = getFriends;
  public getUser = getUser;
  public getUserById = getUserById;
  public getChannelInfo = getChannelInfo;
  public getMessagesForChannel = getMessagesForChannel;
  public getNoWinnedMatchs = getNoWinnedMatchs;
  public getNolostMatchs = getNolostMatchs;
  public getMatchHistory = getMatchHistory;
  public getRatio = getRatio;
  public getChannelUsers = getChannelUsers;
  public uploadPhoto = uploadPhoto;
  public getLastPhotoPath = getLastPhotoPath;
  public getUsersRanking = getUsersRanking;
  public getSidebar = getSidebar;
  public leaveChannel = leaveChannel;
  public deleteMuteUser = deleteMuteUser;
  public getMuteInfo = getMuteInfo;
  public getBanInfo = getBanInfo;
  public setBanUser = setBanUser;
  public deleteBan = deleteBan;
  public isAdmin = isAdmin;
  public isCreator = isCreator;
  public removeChannelPass = removeChannelPass;
  public getPublicChannels = getPublicChannels;
  public getChannelsForUser = getchannelsForUser;
  public setBlockUser = setBlockUser;
  public deleteBlockUser = deleteBlockUser;
}
