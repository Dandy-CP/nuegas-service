import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentBody, EditCommentBody } from './dto/payload.dto';
import { GetUser } from '../auth/decorator/user.decorator';
import { JWTPayloadUser } from '../auth/types/auth.type';
import { CommentQuery } from './dto/query.dto';
import { QueryPagination } from '../prisma/dto/pagination.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  getListComment(
    @Query() query: CommentQuery,
    @Query() queryPage: QueryPagination,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.commentService.getListComment(
      query.post_id,
      query.assignment_id,
      query.quiz_id,
      query.assignments_result_id,
      query.quiz_result_id,
      queryPage,
      user.user_id,
    );
  }

  @Post()
  createComment(
    @Body() payload: CreateCommentBody,
    @GetUser() user: JWTPayloadUser,
    @Query() query: CommentQuery,
  ) {
    return this.commentService.createComment(
      payload,
      user.user_id,
      query.post_id,
      query.assignment_id,
      query.quiz_id,
      query.assignments_result_id,
      query.quiz_result_id,
    );
  }

  @Put()
  editComment(
    @Body() payload: EditCommentBody,
    @Query('comment_id') commentId: string,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.commentService.editPostComment(
      payload,
      commentId,
      user.user_id,
    );
  }

  @Delete()
  deleteComment(@Query('comment_id') commentId: string) {
    return this.commentService.deletePostComment(commentId);
  }
}
