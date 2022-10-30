import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma.service';

@WebSocketGateway({ namespace: '/leaderboard' })
export class LeaderboardGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(LeaderboardGateway.name);

  constructor(private db: PrismaService) {}

  async handleConnection(socket: Socket) {
    this.logger.log(`Socket connected: ${socket.id}`);
  }

  async handleDisconnect(socket: Socket) {
    clearInterval(socket.data.myTopInterval);
    clearInterval(socket.data.myUsersInterval);
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }

  @SubscribeMessage('top-ten')
  async sendTop10(client: Socket) {
    const top10 = await this.db.getTopTen();
    client.emit('top-ten', top10);
    client.data.myTopInterval = setInterval(async () => {
      const top10 = await this.db.getTopTen();
      client.emit('top-ten', top10);
    }, 1000);
  }

  @SubscribeMessage('allUsers')
  async sendAllUsers(client: Socket) {
    const allUsers = await this.db.getUsersRanking();
    client.emit('allUsers', allUsers);
    client.data.myUsersInterval = setInterval(async () => {
      const allUsers = await this.db.getUsersRanking();
      client.emit('allUsers', allUsers);
    }, 1000);
  }
}
