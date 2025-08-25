import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { ClassService } from '../class/class.service';
import { ClassModule } from '../class/class.module';

@Module({
  imports: [ClassModule],
  controllers: [CommentController],
  providers: [CommentService, ClassService],
})
export class CommentModule {}
