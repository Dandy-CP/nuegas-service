import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { ClassModule } from 'src/class/class.module';
import { ClassService } from 'src/class/class.service';

@Module({
  imports: [ClassModule],
  controllers: [QuizController],
  providers: [QuizService, ClassService],
})
export class QuizModule {}
