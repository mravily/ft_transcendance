import { UserI } from "src/user/model/user.interface";
import { channelI } from "../channel/channel.interface";


export interface MessageI {
  id?: number;
  isNotif?: boolean;
  text: string;
  user: string;
  channel: string;
  createdAt: Date;
}