import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import {
  onDeleteMessageBody,
  onEditMessageBody,
  onReadMessageBody,
  onSendMessageBody,
} from './dto/payload.dto';
import { JWTPayloadUser } from '../auth/types/auth.type';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async onConnect(client: Socket) {
    const chatId = client.handshake.query.chatId as string;
    const isChatList = client.handshake.query.isChatList as string;
    const isNotification = client.handshake.query.isNotification as string;
    const user = client.data.user as JWTPayloadUser;

    // Listen to chat list if query isChatList true
    if (isChatList === 'true') {
      client.join(user.user_id);
      await this.onListenToChatList(client);
      return;
    }

    // Listen to chat notification if query isNotification is true
    if (isNotification === 'true') {
      client.join(user.user_id);
      return;
    }

    // disconnect if query chatId not provided
    if (!chatId) {
      client.disconnect();
      return;
    }

    // Validate is user has chat before with receiver or not
    await this.validateUserPrivateChat(client, chatId, user.user_id);

    // Get all existing chat on first connect
    const existingChat = await this.getExistingMessage(chatId, user.user_id);

    // Connect and join to existing chatId on DB
    client.join(chatId);

    client.emit('onConnected', {
      data: existingChat.data,
    });
  }

  onDisconnect(client: Socket) {
    console.log(`Client ${client.id} has disconnect`);
  }

  async onSendMessage(client: Socket, body: onSendMessageBody) {
    const user = client.data.user as JWTPayloadUser;
    const chatId = client.handshake.query.chatId as string;

    const createdMessage = await this.prisma.privateMessage.create({
      data: {
        chat_id: chatId,
        sender_id: user.user_id,
        message: body.message,
      },
      include: {
        sender: {
          select: {
            user_id: true,
            name: true,
            email: true,
          },
        },
        chat: {
          include: {
            users: {
              where: {
                user_id: {
                  not: user.user_id,
                },
              },
              take: 1,
            },
          },
        },
      },
    });

    // Update Last Message
    await this.prisma.privateChat.update({
      where: { chat_id: chatId },
      data: { last_message_at: new Date() },
    });

    const { chat, ...message } = createdMessage;
    const receiverId = chat.users[0].user_id;

    // Send event to receiver
    client.to(chatId).emit('onReceiveMessage', {
      data: {
        ...message,
        self: false,
      },
    });

    // Send event to sender
    client.emit('onReceiveMessage', {
      data: {
        ...message,
        self: true,
      },
    });

    this.onChatNotification(client, receiverId, {
      chatId: createdMessage.chat_id,
      name: createdMessage.sender.name,
      message: createdMessage.message,
    });

    client.to(receiverId).emit('onChatListUpdate', {
      data: {
        chatId: createdMessage.chat_id,
        partner: {
          id: createdMessage.sender.user_id,
          name: createdMessage.sender.name,
          email: createdMessage.sender.email,
        },
        lastMessage: {
          message_id: createdMessage.message_id,
          chat_id: createdMessage.chat_id,
          sender_id: createdMessage.sender_id,
          message: createdMessage.message,
          created_at: createdMessage.created_at,
          updated_at: createdMessage.updated_at,
          read_at: createdMessage.read_at,
        },
      },
    });
  }

  async onDeleteMessage(client: Socket, body: onDeleteMessageBody) {
    const chatId = client.handshake.query.chatId as string;

    const deletedMessage = await this.prisma.privateMessage.delete({
      where: {
        message_id: body.message_id,
      },
    });

    client.to(chatId).emit('onMessageDeleted', {
      data: deletedMessage,
    });

    // Send same event to sender
    client.emit('onMessageDeleted', {
      data: deletedMessage,
    });
  }

  async onEditMessage(client: Socket, body: onEditMessageBody) {
    const chatId = client.handshake.query.chatId as string;

    const editedMessage = await this.prisma.privateMessage.update({
      where: {
        message_id: body.message_id,
      },
      data: {
        message: body.new_message,
      },
    });

    client.to(chatId).emit('onMessageEdited', {
      data: editedMessage,
    });

    // Send same event to sender
    client.emit('onMessageEdited', {
      data: editedMessage,
    });
  }

  async onReadMessage(client: Socket, body: onReadMessageBody) {
    const chatId = client.handshake.query.chatId as string;

    const readedMessage = await this.prisma.privateMessage.update({
      where: {
        message_id: body.message_id,
      },
      data: {
        read_at: body.read_at,
      },
    });

    client.to(chatId).emit('onMessageReaded', {
      data: readedMessage,
    });

    // Send same event to sender
    client.emit('onMessageReaded', {
      data: readedMessage,
    });
  }

  async onListenToChatList(client: Socket) {
    const user = client.data.user as JWTPayloadUser;

    const chat = await this.getUserChatList(user.user_id);

    client.emit('onChatList', {
      data: chat,
    });
  }

  onChatNotification(
    client: Socket,
    receiverId: string,
    payload: { chatId: string; name: string; message: string },
  ) {
    client.to(receiverId).emit('onNotification', payload);
  }

  async getUserChatList(userId: string) {
    const chatList = await this.prisma.privateChat.findMany({
      where: {
        users: {
          some: {
            user_id: userId,
          },
        },
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
        messages: {
          orderBy: { created_at: 'desc' },
          take: 1,
        },
      },
      orderBy: {
        last_message_at: 'desc',
      },
    });

    return chatList.map((chat) => {
      const partner = chat.users.find(
        (value) => value.user_id !== userId,
      )?.user;

      const lastMessage = chat.messages[0] || null;

      return {
        chatId: chat.chat_id,
        partner: partner
          ? { id: partner.user_id, name: partner.name, email: partner.email }
          : null,
        lastMessage,
      };
    });
  }

  async getNextMessage(client: Socket, lastMessageId: string) {
    const chatId = client.handshake.query.chatId as string;
    const user = client.data.user as JWTPayloadUser;

    const existingChatInDB = await this.prisma.privateMessage.findMany({
      where: {
        chat_id: chatId,
      },
      select: {
        message_id: true,
        message: true,
        created_at: true,
        read_at: true,
        sender: {
          select: {
            user_id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
      take: 10,
      skip: 1,
      cursor: { message_id: lastMessageId },
    });

    const messageData = existingChatInDB.reverse().map((value) => {
      return {
        ...value,
        self: value.sender.user_id === user.user_id,
      };
    });

    client.emit('onNextMessage', {
      data: messageData,
    });
  }

  async getExistingMessage(chatId: string, userId: string) {
    const existingChatInDB = await this.prisma.privateMessage.findMany({
      where: {
        chat_id: chatId,
      },
      select: {
        message_id: true,
        message: true,
        created_at: true,
        read_at: true,
        sender: {
          select: {
            user_id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
      take: 10,
    });

    return {
      data: existingChatInDB.reverse().map((value) => {
        return {
          ...value,
          self: value.sender.user_id === userId,
        };
      }),
    };
  }

  async startNewChat(senderId: string, receiverId: string) {
    const existingChat = await this.prisma.privateChat.findFirst({
      where: {
        users: {
          every: {
            user_id: { in: [senderId, receiverId] },
          },
        },
      },
      include: {
        users: true,
      },
    });

    if (existingChat) {
      throw new UnprocessableEntityException(`Chat has been exist`);
    }

    return await this.prisma.privateChat.create({
      data: {
        users: {
          create: [
            { user: { connect: { user_id: senderId } } },
            { user: { connect: { user_id: receiverId } } },
          ],
        },
      },
      include: {
        users: {
          include: {
            user: {
              select: {
                user_id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        messages: true,
      },
    });
  }

  async deleteChat(client: Socket, chatId: string) {
    const user = client.data.user as JWTPayloadUser;

    const existingChat = await this.prisma.privateChat.findFirst({
      where: {
        chat_id: chatId,
      },
      include: {
        users: true,
      },
    });

    if (!existingChat) {
      client.emit('onError', {
        message: 'Chat Not Exist',
      });
    }

    await this.prisma.privateChat.delete({
      where: {
        chat_id: chatId,
      },
    });

    const chat = await this.getUserChatList(user.user_id);

    client.emit('onChatListDeleted', {
      data: chat,
    });
  }

  async validateUserPrivateChat(
    client: Socket,
    chatId: string,
    userId: string,
  ) {
    const privateChatInDB = await this.prisma.privateChatUser.findUnique({
      where: {
        chat_id_user_id: {
          chat_id: chatId,
          user_id: userId,
        },
      },
    });

    if (!privateChatInDB) {
      client.disconnect();
    }
  }
}
