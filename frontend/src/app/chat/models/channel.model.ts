import { MessageI } from "./chat.model";

export interface channelI {
  // basic info
  name: string;
  isDirect: boolean; // à rajouter dans le schéma Prisma
  isPrivate: boolean;
  creator: string; // à rajouter dans le schéma Prisma
  password?: string;
  
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