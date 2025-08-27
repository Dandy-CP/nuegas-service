import { Controller, Get, Post, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { GetUser } from '../auth/decorator/user.decorator';
import { JWTPayloadUser } from '../auth/types/auth.type';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  getUserChatList(@GetUser() user: JWTPayloadUser) {
    return this.chatService.getUserChatList(user.user_id);
  }

  @Get('/existing-message')
  getExistingMessage(
    @Query('chat_id') chatId: string,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.chatService.getExistingMessage(chatId, user.user_id);
  }

  @Post('/new-chat')
  startNewChat(
    @GetUser() user: JWTPayloadUser,
    @Query('receiverId') receiverId: string,
  ) {
    return this.chatService.startNewChat(user.user_id, receiverId);
  }
}
