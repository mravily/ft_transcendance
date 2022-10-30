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
  myInterval: any;
  private readonly logger = new Logger(LeaderboardGateway.name);

  constructor(private db: PrismaService) {}

  async handleConnection(socket: Socket) {
    this.logger.log(`Socket connected: ${socket.id}`);
  }

  async handleDisconnect(socket: Socket) {
    clearInterval(this.myInterval);
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }

  @SubscribeMessage('top-ten')
  async sendTop10(client: Socket) {
    const top10 = await this.db.getTopTen();
    client.emit('top-ten', top10);
    setInterval(async () => {
      const top10 = await this.db.getTopTen();
      client.emit('top-ten', top10);
    }, 5000);
  }

  @SubscribeMessage('allUsers')
  async sendAllUsers(client: Socket) {
    const allUsers = await this.db.getUsersRanking();
    client.emit('allUsers', allUsers);
    this.myInterval = setInterval(async () => {
      const allUsers = await this.db.getUsersRanking();
      client.emit('allUsers', allUsers);
    }, 5000);
  }
}
