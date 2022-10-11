import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as leaderboard from './prisma/leaderboard.service';
import * as user from './prisma/user.service';
import * as channel from './prisma/channel.service';
import * as match from './prisma/match.service';
import * as sidebar from './prisma/sidebar.service';
import * as profile from './prisma/profile.service';
import * as overview from './prisma/overview.service'

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

  public getSidebar         = sidebar.getSidebar;
  public getTopTen          = leaderboard.getTopTen;
  public getUsersRanking    = leaderboard.getUsersRanking;
  public setUser            = user.setUser;
  public getUserAccount     = user.getUserAccount;
  public deleteBlockUser    = user.deleteBlockUser;
  public getBlockedUsers    = user.getBlockedUsers;
  public setBlockUser       = user.setBlockUser;
  public sendFriendReq      = user.sendFriendReq;
  public is2FA              = user.is2FA;
  public set2FA             = user.set2FA;
  public get2FA             = user.get2FA;
  public delete2FA          = user.delete2FA;
  public switch2FA          = user.switch2FA;
  public updateUserScore    = user.updateUserScore;
  public updateUserStatus   = user.updateUserStatus;
  public getFriends         = user.getFriends;
  public getFriendsById     = user.getFriendsById;
  public uploadPhoto        = user.uploadPhoto;
  public getLastPhoto       = user.getLastPhoto;
  public setUserToken       = user.setUserToken;
  public getUserToken       = user.getUserToken;
  public getUserEmail       = user.getUserEmail;
  public isUser             = user.isUser;
  public setMatch           = match.setMatch;
  public setMatchWinner     = match.setMatchWinner;
  public setMatchLooser     = match.setMatchLooser;
  public getNoWinnedMatchs  = match.getNoWinnedMatchs;
  public getNolostMatchs    = match.getNolostMatchs;
  public getMatchHistory    = match.getMatchHistory;
  public getRatio           = match.getRatio;
  public getRatioById       = match.getRatioById;
  public setChannelPass     = channel.setChannelPass;
  public removeChannelPass  = channel.removeChannelPass;
  public getChannelInfo     = channel.getChannelInfo;
  public getChannelUsers    = channel.getChannelUsers;
  public createchannel      = channel.setChannel;
  public setChannelMessage  = channel.setChannelMessage;
  public setJoinChannel     = channel.setJoinChannel;
  public setMuteUser        = channel.setMuteUser;
  public deleteMuteUser     = channel.deleteMuteUser;
  public getMuteInfo        = channel.getMuteInfo;
  public setMakeAdmin       = channel.setMakeAdmin;
  public deleteMakeAdmin    = channel.deleteMakeAdmin;
  public leaveChannel       = channel.leaveChannel;
  public setBanUser         = channel.setBanUser;
  public deleteBan          = channel.deleteBan;
  public isAdmin            = channel.isAdmin;
  public isCreator          = channel.isCreator;
  public getPublicChannels  = channel.getPublicChannels;
  public getChannelsForUser = channel.getchannelsForUser;
  public getUserRank        = profile.getUserRank;
  public getUserProfile     = profile.getUserProfile;
  public getPublicProfile   = profile.getPublicProfile;
  public getTotalFriends    = overview.getTotalFiends;
  public getProfileOverview = overview.getProfileOverview;
}