import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket, Server } from 'socket.io';
import { GroupChatService } from './group-chat.service';
import { WsAuthGuard } from '../auth/socket.guard';
import { AuthWsMiddleware } from '../auth/middleware/auth-ws.middleware';
import {
  onDeleteMessageBody,
  onEditMessageBody,
  onReadMessageBody,
  onSendMessageBody,
} from './payload.dto';

@WebSocketGateway({
  namespace: 'group-chat',
  cors: {
    origin: '*',
  },
})
@UseGuards(WsAuthGuard)
export class GroupChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit<Server>
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly groupChatService: GroupChatService,
    private jwtService: JwtService,
  ) {}

  afterInit() {
    this.server.use(AuthWsMiddleware(this.jwtService));
  }

  handleConnection(client: Socket) {
    return this.groupChatService.onConnect(client);
  }

  handleDisconnect(client: Socket) {
    return this.groupChatService.onDisconnect(client);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() body: onSendMessageBody,
    @ConnectedSocket() client: Socket,
  ) {
    return this.groupChatService.onSendMessage(client, body);
  }

  @SubscribeMessage('deleteMessage')
  handleMessageDeleted(
    @MessageBody() body: onDeleteMessageBody,
    @ConnectedSocket() client: Socket,
  ) {
    return this.groupChatService.onDeleteMessage(client, body);
  }

  @SubscribeMessage('editMessage')
  handleEditMessage(
    @MessageBody() body: onEditMessageBody,
    @ConnectedSocket() client: Socket,
  ) {
    return this.groupChatService.onEditMessage(client, body);
  }

  @SubscribeMessage('readMessage')
  handleReadMessage(
    @MessageBody() body: onReadMessageBody,
    @ConnectedSocket() client: Socket,
  ) {
    return this.groupChatService.onReadMessage(client, body);
  }
}
