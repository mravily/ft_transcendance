
export interface MessageI {
  id?: number;
  isNotif?: boolean;
  message: string;
  user: string;
  channel: string;
  createdAt?: Date;
}