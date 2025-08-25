import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { ClassModule } from 'src/class/class.module';
import { ClassService } from 'src/class/class.service';

@Module({
  imports: [ClassModule],
  controllers: [PostController],
  providers: [PostService, ClassService],
})
export class PostModule {}
