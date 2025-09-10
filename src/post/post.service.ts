import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClassService } from '../class/class.service';
import { CreatePostBody, EditPostBody } from './dto/payload.dto';
import { QueryPagination } from '../prisma/dto/pagination.dto';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private classService: ClassService,
  ) {}

  async getClassPostTimeline(
    classId: string,
    queryPage: QueryPagination,
    userId: string,
  ) {
    await this.classService.isMemberInClass(userId);

    const [data, meta] = await this.prisma
      .extends()
      .classPost.paginate({
        where: {
          class_id: classId,
        },
        orderBy: {
          created_at: 'desc',
        },
        include: {
          user: {
            select: {
              user_id: true,
              name: true,
              profile_image: true,
            },
          },
          comment: {
            include: {
              user: {
                select: {
                  user_id: true,
                  name: true,
                  profile_image: true,
                },
              },
            },
            omit: {
              post_id: true,
              user_id: true,
              assignments_id: true,
              assignments_result_id: true,
              quiz_id: true,
              quiz_result_id: true,
            },
          },
        },
        omit: {
          class_id: true,
          user_id: true,
        },
      })
      .withPages({
        page: queryPage.page,
        limit: queryPage.limit,
      });

    return {
      data,
      meta,
    };
  }

  async getPostDetail(postId: string, userId: string) {
    await this.classService.isMemberInClass(userId);

    const postInDB = await this.prisma.classPost.findUnique({
      where: {
        post_id: postId,
      },
      include: {
        comment: {
          include: {
            user: {
              select: {
                user_id: true,
                name: true,
                profile_image: true,
              },
            },
          },
          omit: {
            post_id: true,
            user_id: true,
            assignments_id: true,
            assignments_result_id: true,
            quiz_id: true,
            quiz_result_id: true,
          },
        },
      },
      omit: {
        class_id: true,
        user_id: true,
      },
    });

    if (!postInDB) throw new NotFoundException('Post not found');

    return postInDB;
  }

  async createClassPost(
    payload: CreatePostBody,
    classId: string,
    userId: string,
  ) {
    const classInDB = await this.prisma.class.findUnique({
      where: {
        class_id: classId,
        class_members: {
          some: {
            user_id: userId,
          },
        },
      },
    });

    if (!classInDB)
      throw new NotFoundException('Class not found / User has not in class');

    await this.classService.isMemberInClass(userId);

    return await this.prisma.classPost.create({
      data: {
        content: payload.content,
        class: {
          connect: {
            class_id: classId,
          },
        },
        user: {
          connect: {
            user_id: userId,
          },
        },
      },
    });
  }

  async editClassPost(payload: EditPostBody, postId: string, userId: string) {
    const classPostInDB = await this.prisma.classPost.findUnique({
      where: {
        post_id: postId,
      },
    });

    if (!classPostInDB) throw new NotFoundException('Class post not found');

    await this.classService.isMemberInClass(userId);

    return await this.prisma.classPost.update({
      data: {
        content: payload.content,
      },
      where: {
        post_id: postId,
      },
    });
  }

  async deleteClassPost(postId: string, userId: string) {
    const classPostInDB = await this.prisma.classPost.findUnique({
      where: {
        post_id: postId,
      },
    });

    if (!classPostInDB) throw new NotFoundException('Class post not found');

    await this.classService.isMemberInClass(userId);

    await this.prisma.comment.deleteMany({
      where: {
        post_id: postId,
      },
    });

    await this.prisma.classPost.delete({
      where: {
        post_id: postId,
      },
    });

    return {
      message: 'Success delete class post',
    };
  }
}
