import { MessageI } from "./message.interface";

export interface channelI {
  // basic info
  channelName: string;
  isDirect: boolean; // à rajouter dans le schéma Prisma
  isPrivate: boolean;
  creator: string; // à rajouter dans le schéma Prisma
  is_pwd: boolean;
  pwd: string;
  
  // advanced info
  createdAt?: Date;
  userList?: string[];
  userAdminList?: string[];
  mutedUserList?: string[];
  bannedUsers?: string[];
  
  messages?: MessageI[];
  // description?: string; // à rajouter par Juan
}
export interface eventI {
  from: string;
  to: string;
  eventDate?: Date;
  eventDuration?: number;
}