import { MessageI } from "./message.interface";

export interface channelI {
  // basic info
  name: string;
  isDirect: boolean; // à rajouter dans le schéma Prisma
  isPrivate: boolean;
  creator: string; // à rajouter dans le schéma Prisma
  password?: string;
  
  // advanced info
  createdAt?: Date;
  users?: string[];
  admins?: string[];
  mutedUsers?: string[];
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