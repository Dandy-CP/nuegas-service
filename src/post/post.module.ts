import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { ClassModule } from '../class/class.module';
import { ClassService } from '../class/class.service';

@Module({
  imports: [ClassModule],
  controllers: [PostController],
  providers: [PostService, ClassService],
})
export class PostModule {}
