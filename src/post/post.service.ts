import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostBody, EditPostBody } from './dto/payload.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async getClassPostTimeline(classId: string) {
    return await this.prisma.classPost.findMany({
      where: {
        class_id: classId,
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
    });
  }

  async getPostDetail(postId: string) {
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

  async getPostListComment(postId: string) {
    return await this.prisma.comment.findMany({
      where: {
        post_id: postId,
      },
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
    });
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

  async editClassPost(payload: EditPostBody, postId: string) {
    const classPostInDB = await this.prisma.classPost.findUnique({
      where: {
        post_id: postId,
      },
    });

    if (!classPostInDB) throw new NotFoundException('Class post not found');

    return await this.prisma.classPost.update({
      data: {
        content: payload.content,
      },
      where: {
        post_id: postId,
      },
    });
  }

  async deleteClassPost(postId: string) {
    const classPostInDB = await this.prisma.classPost.findUnique({
      where: {
        post_id: postId,
      },
    });

    if (!classPostInDB) throw new NotFoundException('Class post not found');

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
