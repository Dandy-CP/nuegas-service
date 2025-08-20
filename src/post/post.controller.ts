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
import {
  CreateCommentBody,
  CreatePostBody,
  EditCommentBody,
  EditPostBody,
} from './dto/payload.dto';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { JWTPayloadUser } from 'src/auth/types/auth.type';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/timeline')
  getPostTimeline(@Query('class_id') classId: string) {
    return this.postService.getClassPostTimeline(classId);
  }

  @Get('/detail')
  getPostDetail(@Query('post_id') postId: string) {
    return this.postService.getPostDetail(postId);
  }

  @Get('/list-comment')
  getListComment(@Query('post_id') postId: string) {
    return this.postService.getPostListComment(postId);
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
  ) {
    return this.postService.editClassPost(payload, postId);
  }

  @Delete()
  deletePost(@Query('post_id') postId: string) {
    return this.postService.deleteClassPost(postId);
  }

  @Post('/comment')
  createPostComment(
    @Body() payload: CreateCommentBody,
    @Query('post_id') postId: string,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.postService.createPostComment(payload, user.user_id, postId);
  }

  @Put('/comment')
  editPostComment(
    @Body() payload: EditCommentBody,
    @Query('comment_id') commentId: string,
  ) {
    return this.postService.editPostCommnet(payload, commentId);
  }

  @Delete('/comment')
  deletePostComment(@Query('comment_id') commentId: string) {
    return this.postService.deletePostComment(commentId);
  }
}
