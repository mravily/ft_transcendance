import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './gateway/chat.gateway';
import { channelEntity } from './model/channel/channel.entity';
import { channelService } from './service/channel-service/channel.service';
import { ConnectedUserService } from './service/connected-user/connected-user.service';
import { ConnectedUserEntity } from './model/connected-user/connected-user.entity';
import { MessageEntity } from './model/message/message.entity';
import { JoinedchannelEntity } from './model/joined-channel/joined-channel.entity';
import { JoinedchannelService } from './service/joined-channel/joined-channel.service';
import { MessageService } from './service/message/message.service';

@Module({
  imports: [AuthModule, UserModule,
    TypeOrmModule.forFeature([
      channelEntity,
      ConnectedUserEntity,
      MessageEntity,
      JoinedchannelEntity
    ])
  ],
  providers: [ChatGateway, channelService, ConnectedUserService, JoinedchannelService, MessageService]
})
export class ChatModule { }
