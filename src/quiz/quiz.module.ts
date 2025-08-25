import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { ClassModule } from '../class/class.module';
import { ClassService } from '../class/class.service';

@Module({
  imports: [ClassModule],
  controllers: [QuizController],
  providers: [QuizService, ClassService],
})
export class QuizModule {}
