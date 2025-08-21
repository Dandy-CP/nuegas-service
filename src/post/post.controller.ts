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
}
