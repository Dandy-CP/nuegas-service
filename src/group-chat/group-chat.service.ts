import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { JWTPayloadUser } from '../auth/types/auth.type';
import {
  onDeleteMessageBody,
  onEditMessageBody,
  onReadMessageBody,
  onSendMessageBody,
} from './payload.dto';

@Injectable()
export class GroupChatService {
  constructor(private prisma: PrismaService) {}

  async onConnect(client: Socket) {
    const groupChatId = client.handshake.query.groupChatId as string;
    const user = client.data.user as JWTPayloadUser;

    // disconnect if query groupChatId not provided
    if (!groupChatId) {
      client.disconnect();
      return;
    }

    // Validate is user part of group or not
    await this.validateUserGroupChat(client, groupChatId, user.user_id);

    const existingChat = await this.getExistingGroupMessage(
      groupChatId,
      user.user_id,
    );

    client.join(groupChatId);

    client.emit('onConnected', existingChat);
  }

  onDisconnect(client: Socket) {
    console.log(`Client ${client.id} has disconnect`);
  }

  async onSendMessage(client: Socket, body: onSendMessageBody) {
    const groupChatId = client.handshake.query.groupChatId as string;
    const user = client.data.user as JWTPayloadUser;

    const createdMessage = await this.prisma.groupMessage.create({
      data: {
        group_chat_id: groupChatId,
        message: body.message,
        sender_id: user.user_id,
      },
      include: {
        sender: {
          select: {
            user_id: true,
            name: true,
            email: true,
          },
        },
      },
      omit: {
        group_chat_id: true,
        sender_id: true,
      },
    });

    client.to(groupChatId).emit('onReceiveMessage', createdMessage);

    this.onGroupChatNotification(client, {
      groupChatId: createdMessage.id,
      name: createdMessage.sender.name,
      message: createdMessage.message,
    });
  }

  async onDeleteMessage(client: Socket, body: onDeleteMessageBody) {
    const groupChatId = client.handshake.query.groupChatId as string;

    const deletedMessage = await this.prisma.groupMessage.delete({
      where: {
        id: body.message_id,
      },
    });

    client.to(groupChatId).emit('onMessageDeleted', {
      data: deletedMessage,
    });
  }

  async onEditMessage(client: Socket, body: onEditMessageBody) {
    const groupChatId = client.handshake.query.groupChatId as string;

    const editedMessage = await this.prisma.groupMessage.update({
      where: {
        id: body.message_id,
      },
      data: {
        message: body.new_message,
      },
    });

    client.to(groupChatId).emit('onMessageEdited', {
      data: editedMessage,
    });
  }

  async onReadMessage(client: Socket, body: onReadMessageBody) {
    const groupChatId = client.handshake.query.groupChatId as string;

    const readedMessage = await this.prisma.groupMessage.update({
      where: {
        id: body.message_id,
      },
      data: {
        read_at: body.read_at,
      },
    });

    client.to(groupChatId).emit('onMessageReaded', {
      data: readedMessage,
    });
  }

  onGroupChatNotification(
    client: Socket,
    payload: { groupChatId: string; name: string; message: string },
  ) {
    client.broadcast.emit('onNotification', payload);
  }

  async getExistingGroupMessage(
    groupChatId: string,
    userId: string,
    takeMessage: number = 10,
  ) {
    const existingChat = await this.prisma.groupMessage.findMany({
      where: {
        group_chat_id: groupChatId,
      },
      include: {
        sender: {
          select: {
            user_id: true,
            name: true,
            email: true,
          },
        },
      },
      omit: {
        group_chat_id: true,
        sender_id: true,
      },
      orderBy: { created_at: 'desc' },
      take: takeMessage,
    });

    return existingChat.reverse().map((value) => {
      return {
        ...value,
        self: value.sender.user_id === userId,
      };
    });
  }

  async validateUserGroupChat(
    client: Socket,
    groupChatId: string,
    userId: string,
  ) {
    const groupChatInDB = await this.prisma.groupChatUser.findUnique({
      where: {
        group_chat_id_user_id: {
          group_chat_id: groupChatId,
          user_id: userId,
        },
      },
    });

    if (!groupChatInDB) {
      client.disconnect();
    }
  }
}
