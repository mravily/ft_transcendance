
export interface MessageI {
    isNotif?: boolean;
    text: string;
    user: string;
    channel: string;
    createdAt: Date;
}
export interface PageI {
    page: number;
    limit: number;
  }