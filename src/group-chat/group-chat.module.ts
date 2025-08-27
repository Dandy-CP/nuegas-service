import { Module } from '@nestjs/common';
import { GroupChatService } from './group-chat.service';
import { GroupChatGateway } from './group-chat.gateway';

@Module({
  providers: [GroupChatGateway, GroupChatService],
})
export class GroupChatModule {}
