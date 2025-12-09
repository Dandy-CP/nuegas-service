import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClassService } from '../class/class.service';
import { CreateCommentBody, EditCommentBody } from './dto/payload.dto';
import { QueryPagination } from '../prisma/dto/pagination.dto';

@Injectable()
export class CommentService {
  constructor(
    private prisma: PrismaService,
    private classService: ClassService,
  ) {}

  async getListComment(
    postId: string,
    assignmentId: string,
    quizId: string,
    assignments_result_id: string,
    quiz_result_id: string,
    queryPage: QueryPagination,
    userId: string,
  ) {
    if (
      !postId &&
      !assignmentId &&
      !quizId &&
      !assignments_result_id &&
      !quiz_result_id
    )
      throw new UnprocessableEntityException('Query not provided');

    await this.classService.isMemberInClass(userId);

    const [data, meta] = await this.prisma
      .extends()
      .comment.paginate({
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

    await this.classService.isMemberInClass(userId);

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

  async editPostComment(
    payload: EditCommentBody,
    commentId: string,
    userId: string,
  ) {
    if (!commentId)
      throw new UnprocessableEntityException('Query "comment_id" not provided');

    const commentInDB = await this.prisma.comment.findUnique({
      where: {
        comment_id: commentId,
      },
    });

    if (!commentInDB) throw new NotFoundException('Comment not found');

    await this.classService.isMemberInClass(userId);

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
