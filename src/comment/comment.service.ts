import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentBody, EditCommentBody } from './dto/payload.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async getListComment(
    postId: string,
    assignmentId: string,
    quizId: string,
    assignments_result_id: string,
    quiz_result_id: string,
  ) {
    if (
      !postId &&
      !assignmentId &&
      !quizId &&
      !assignments_result_id &&
      !quiz_result_id
    )
      throw new UnprocessableEntityException('Query not provided');

    return await this.prisma.comment.findMany({
      where: {
        post_id: postId,
        assignments_id: assignmentId,
        quiz_id: quizId,
        assignments_result_id: assignments_result_id,
        quiz_result_id: quiz_result_id,
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

  async createComment(
    payload: CreateCommentBody,
    userId: string,
    postId: string,
    assignmentId: string,
    quizId: string,
    assignments_result_id: string,
    quiz_result_id: string,
  ) {
    if (
      !postId &&
      !assignmentId &&
      !quizId &&
      !assignments_result_id &&
      !quiz_result_id
    )
      throw new UnprocessableEntityException('Query not provided');

    return await this.prisma.comment.create({
      data: {
        content: payload.content,
        user_id: userId,
        post_id: postId,
        assignments_id: assignmentId,
        quiz_id: quizId,
        assignments_result_id: assignments_result_id,
        quiz_result_id: quiz_result_id,
      },
    });
  }

  async editPostCommnet(payload: EditCommentBody, commentId: string) {
    if (!commentId)
      throw new UnprocessableEntityException('Query "comment_id" not provided');

    const commentInDB = await this.prisma.comment.findUnique({
      where: {
        comment_id: commentId,
      },
    });

    if (!commentInDB) throw new NotFoundException('Comment not found');

    await this.prisma.comment.update({
      data: {
        content: payload.content,
      },
      where: {
        comment_id: commentId,
      },
    });

    return {
      message: 'Success edit post comment',
    };
  }

  async deletePostComment(commentId: string) {
    if (!commentId)
      throw new UnprocessableEntityException('Query "comment_id" not provided');

    const commentInDB = await this.prisma.comment.findUnique({
      where: {
        comment_id: commentId,
      },
    });

    if (!commentInDB) throw new NotFoundException('Comment not found');

    await this.prisma.comment.delete({
      where: {
        comment_id: commentId,
      },
    });

    return {
      message: 'Success delete comment',
    };
  }
}
