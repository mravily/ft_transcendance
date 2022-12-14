import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { parse } from 'cookie';
import { PrismaService } from '../prisma.service';
import { AuthService } from '../auth/auth.service';
import { IAccount } from '../interfaces';

@WebSocketGateway({ namespace: '/profile' })
export class ProfileGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ProfileGateway.name);

  constructor(
    private db: PrismaService,
    private authService: AuthService
    ) {}

  async handleConnection(client: Socket) {
    this.logger.log(`Socket connected: ${client.id}`);
    try {
        const cookie = parse(client.handshake.headers.cookie);
        const token = cookie['access'];
        if (!token) {
            console.log('token not found');
            client.disconnect();
            return;
        }
        const userId = await this.authService.getUseridFromToken(token);
        console.log('Profile userid: ', userId);
        if (!userId) {
            console.log('User not found');
            client.disconnect();
            return;
        }
        client.data.userId = userId;
    }
    catch (e) {
        //console.log('Error', e);
        client.disconnect();
        return;
    }
  }

  async handleDisconnect(socket: Socket) {
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }

  @SubscribeMessage('settings')
  async getSettings(client: Socket) {
    client.emit('settings', await this.db.getUserProfile(client.data.userId));
  }

  @SubscribeMessage('update')
  async updateProfile(client:Socket, account: IAccount) {
    await this.db.updateUserAccount(client.data.userId, account);
    setTimeout(() => this.db.getUserProfile(client.data.userId).then(tmp => client.emit('update', tmp)), 500);
  }
}
