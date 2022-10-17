
export interface MessageI {
  id?: number; // OSEF
  isNotif?: boolean;
  text: string;
  user: string;
  channel: string;
  createdAt?: Date;
}