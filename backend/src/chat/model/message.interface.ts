
export interface MessageI {
  id?: number;
  isNotif?: boolean;
  text: string;
  user: string;
  channel: string;
  createdAt?: Date;
}