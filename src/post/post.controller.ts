import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostBody, EditPostBody } from './dto/payload.dto';
import { GetUser } from '../auth/decorator/user.decorator';
import { JWTPayloadUser } from '../auth/types/auth.type';
import { QueryPagination } from '../prisma/dto/pagination.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/timeline')
  getPostTimeline(
    @Query('class_id') classId: string,
    @Query() queryPage: QueryPagination,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.postService.getClassPostTimeline(
      classId,
      queryPage,
      user.user_id,
    );
  }

  @Get('/detail')
  getPostDetail(
    @Query('post_id') postId: string,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.postService.getPostDetail(postId, user.user_id);
  }

  @Post('/create')
  createPost(
    @Body() payload: CreatePostBody,
    @Query('class_id') classId: string,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.postService.createClassPost(payload, classId, user.user_id);
  }

  @Put('/edit')
  editPostClass(
    @Body() payload: EditPostBody,
    @Query('post_id') postId: string,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.postService.editClassPost(payload, postId, user.user_id);
  }

  @Delete()
  deletePost(
    @Query('post_id') postId: string,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.postService.deleteClassPost(postId, user.user_id);
  }
}
