import { Req, Session, Request } from "@nestjs/common";
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { PrismaService } from "../prisma.service";
import { parse } from 'cookie';
import { AuthService } from '../auth/auth.service';
// import { Request } from "express";

@WebSocketGateway({namespace: '/sidebar', cors: {origin: '*'}})
export class SidebarGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    constructor(
        private authService: AuthService,
        private db: PrismaService,
        ) {}
    @WebSocketServer() server: Server;

    async handleConnection(client: Socket) {
        // console.log('Sidebar connected', client.id);
        try {
            const cookie = parse(client.handshake.headers.cookie);
            const token = cookie['access'];
            if (!token) {
                console.log('token not found');
                client.disconnect();
                return;
            }
            const userId = await this.authService.getUseridFromToken(token);
            console.log('userId...', userId);
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

    async handleDisconnect(client: Socket) {
        console.log('Sidebar disconected', client.id);
        client.disconnect();
    }

    afterInit(server) {
        console.log('sidebar afterInit');
        this.server = server;
    }

    @SubscribeMessage('event')
    async getInfo(@ConnectedSocket() client: Socket) {
        client.emit('event', await this.db.getSidebar(client.data.userId));
        setInterval(async () => {
            client.emit('event', await this.db.getSidebar(client.data.userId)),
            5000
        });
    }
}
