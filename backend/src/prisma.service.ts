
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { getTopTen } from './prisma/leaderboard.service';
import { setUser, getUserAccount, setFriend, set2FA, updateUserScore, updateUserStatus, getBlockedUsers, getFriends, getUser, uploadPhoto, getPhotoPath } from './prisma/user.service';
import { getChannel, getChannelUsers, sendChannelMessage, setChannel, setChannelPass, setJoinChannel, setMakeAdmin, setMuteUser } from './prisma/channel.service';
import { getMatchHistory, getNolostMatchs, getNoWinnedMatchs, getRatio, setMatch } from './prisma/match.service';


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
  public setFriend = setFriend;
  public setMatch = setMatch;
  public sendChannelMessage = sendChannelMessage;
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
  public getChannel = getChannel;
  public getNoWinnedMatchs = getNoWinnedMatchs;
  public getNolostMatchs = getNolostMatchs;
  public getMatchHistory = getMatchHistory;
  public getRatio = getRatio;
  public getChannelUsers = getChannelUsers;
  public uploadPhoto = uploadPhoto;
  public getPhotoPath = getPhotoPath;
}
