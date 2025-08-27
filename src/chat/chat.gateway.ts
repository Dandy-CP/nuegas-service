import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { AuthWsMiddleware } from '../auth/middleware/auth-ws.middleware';
import { WsAuthGuard } from '../auth/socket.guard';
import {
  onDeleteMessageBody,
  onEditMessageBody,
  onReadMessageBody,
  onSendMessageBody,
} from './dto/payload.dto';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
@UseGuards(WsAuthGuard)
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit<Server>
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly chatService: ChatService,
    private jwtService: JwtService,
  ) {}

  afterInit() {
    this.server.use(AuthWsMiddleware(this.jwtService));
  }

  handleConnection(client: Socket) {
    return this.chatService.onConnect(client);
  }

  handleDisconnect(client: Socket) {
    return this.chatService.onDisconnect(client);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() body: onSendMessageBody,
    @ConnectedSocket() client: Socket,
  ) {
    return this.chatService.onSendMessage(client, body);
  }

  @SubscribeMessage('deleteMessage')
  handleMessageDeleted(
    @MessageBody() body: onDeleteMessageBody,
    @ConnectedSocket() client: Socket,
  ) {
    return this.chatService.onDeleteMessage(client, body);
  }

  @SubscribeMessage('editMessage')
  handleEditMessage(
    @MessageBody() body: onEditMessageBody,
    @ConnectedSocket() client: Socket,
  ) {
    return this.chatService.onEditMessage(client, body);
  }

  @SubscribeMessage('readMessage')
  handleReadMessage(
    @MessageBody() body: onReadMessageBody,
    @ConnectedSocket() client: Socket,
  ) {
    return this.chatService.onReadMessage(client, body);
  }
}
