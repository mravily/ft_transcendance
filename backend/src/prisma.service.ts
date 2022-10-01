
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { getTopTen, getUsersRanking } from './prisma/leaderboard.service';
import { setUser, getUserAccount, set2FA, updateUserScore, updateUserStatus, getBlockedUsers, getFriends, getUser, uploadPhoto, sendFriendReq, getLastPhotoPath } from './prisma/user.service';
import { getChannel, getChannelUsers, sendChannelMessage, setChannel, setChannelPass, setJoinChannel, setMakeAdmin, setMuteUser } from './prisma/channel.service';
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
  async getPublicChannels(): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  setUnblockUser(from: string, to: string) {
    throw new Error('Method not implemented.');
  }
  setBlockUser(from: string, to: string) {
    throw new Error('Method not implemented.');
  }
  setUnbanUser(from: string, to: string) {
    throw new Error('Method not implemented.');
  }
  setBanUser(from: string, to: string, eventDate: Date, eventDuration: number) {
    throw new Error('Method not implemented.');
  }
  setUnmuteUser(from: string, to: string, eventDate: Date, eventDuration: number) {
    throw new Error('Method not implemented.');
  }
  getMessagesForchannel(channel: channelI, arg1: { limit: number; page: number; }): MessageI[] {
    throw new Error('Method not implemented.');
  }
  unbanUser(login: any, name: string) {
    throw new Error('Method not implemented.');
  }
  getBanInfo(login: any, name: string): import("./chat/model/channel.interface").eventI {
    throw new Error('Method not implemented.');
  }
  async getChannelsForUser(login: any, arg1: PageI): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  unMuteUser(login: any, name: string) {
    throw new Error('Method not implemented.');
  }
  getMuteInfo(login: any, name: string): import("./chat/model/channel.interface").eventI {
    throw new Error('Method not implemented.');
  }
  isAdmin(login: any, channelName: string): boolean {
    throw new Error('Method not implemented.');
  }
  setLeaveChannel(login: any, channelName: string) {
    throw new Error('Method not implemented.');
  }
  removeChannelPass(name: string) {
    throw new Error('Method not implemented.');
  }
  createMessage(message: { isNotif: boolean; text: string; user: string; channel: string; createdAt: Date; }): MessageI {
    throw new Error('Method not implemented.');
  }
  isCreator(login: string): boolean {
    throw new Error('Method not implemented.');
  }
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
  public getLastPhotoPath = getLastPhotoPath;
  public getUsersRanking = getUsersRanking;
  public getSidebar = getSidebar;
}
