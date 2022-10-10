import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { getTopTen, getUsersRanking } from './prisma/leaderboard.service';
import {
  setUser,
  getUserAccount,
  set2FA,
  get2FASecret,
  updateUserScore,
  updateUserStatus,
  getBlockedUsers,
  getFriends,
  getUser,
  uploadPhoto,
  sendFriendReq,
  getLastPhotoPath,
  deleteBlockUser,
  is2FA,
} from './prisma/user.service';
import {
  deleteBan,
  deleteMuteUser,
  getChannelInfo,
  getchannelsForUser,
  getChannelUsers,
  getMuteInfo,
  getPublicChannels,
  isAdmin,
  isCreator,
  leaveChannel,
  removeChannelPass,
  setBanUser,
  setChannel,
  setChannelMessage,
  setChannelPass,
  setJoinChannel,
  setMakeAdmin,
  setMuteUser,
  
} from './prisma/channel.service';
import {
  getMatchHistory,
  getNolostMatchs,
  getNoWinnedMatchs,
  getRatio,
  setMatch,
} from './prisma/match.service';
import { getSidebar } from './prisma/sidebar.service';

export interface accountUser {
  email: string;
  login: string;
  fullName: string;
  avatar: string;
  score: number;
  isOnline: boolean;
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

  protected prisma = new PrismaClient();

  public getTopTen = getTopTen;
  public setUser = setUser;
  public getUserAccount = getUserAccount;
  public createchannel = setChannel;
  public sendFriendReq = sendFriendReq;
  public setMatch = setMatch;
  public setChannelMessage = setChannelMessage;
  public setJoinChannel = setJoinChannel;
  public setMuteUser = setMuteUser;
  public setMakeAdmin = setMakeAdmin;
  public set2FA = set2FA;
  public get2FASecret = get2FASecret;
  public setChannelPass = setChannelPass;
  public updateUserScore = updateUserScore;
  public updateUserStatus = updateUserStatus;
  public getBlockedUsers = getBlockedUsers;
  public getFriends = getFriends;
  public getUser = getUser;
  public getChannelInfo = getChannelInfo;
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
  public setBanUser = setBanUser;
  public deleteBan = deleteBan;
  public isAdmin = isAdmin;
  public isCreator = isCreator;
  public removeChannelPass = removeChannelPass;
  public getPublicChannels = getPublicChannels;
  public getChannelsForUser = getchannelsForUser;
  public deleteBlockUser = deleteBlockUser;
  public is2FA = is2FA;
}
