import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMyTask(userId: string) {
    return await this.prisma.classAssignments.findMany({
      where: {
        class: {
          class_members: {
            some: {
              user_id: userId,
            },
          },
          owner_user_id: {
            not: userId,
          },
        },
      },
      include: {
        class: {
          select: {
            class_id: true,
            name: true,
          },
        },
      },
      omit: {
        topic_id: true,
        user_id: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
