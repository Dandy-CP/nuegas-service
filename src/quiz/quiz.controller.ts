import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizBody, SubmitQuizDto } from './dto/payload.dto';
import { GetUser } from '../auth/decorator/user.decorator';
import { JWTPayloadUser } from '../auth/types/auth.type';
import { QueryPagination } from '../prisma/dto/pagination.dto';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  getQuizList(
    @Query('class_id') classId: string,
    @Query() queryPage: QueryPagination,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.quizService.getClassQuizList(classId, queryPage, user.user_id);
  }

  @Get('/detail')
  getQuizDetail(
    @Query('quiz_id') quizId: string,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.quizService.getClassQuizDetail(quizId, user.user_id);
  }

  @Get('/detail-result')
  getQuizDetailResult(
    @GetUser() user: JWTPayloadUser,
    @Query('quiz_id') quizId: string,
  ) {
    return this.quizService.getMemberResultQuiz(user.user_id, quizId);
  }

  @Get('/all-member-result')
  getAllMemberResult(
    @Query('quiz_id') quizId: string,
    @GetUser() user: JWTPayloadUser,
    @Query() queryPage: QueryPagination,
  ) {
    return this.quizService.getAllMemberResultQuiz(
      quizId,
      queryPage,
      user.user_id,
    );
  }

  @Post()
  createQuiz(
    @Body() payload: CreateQuizBody,
    @Query('class_id') classId: string,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.quizService.createQuiz(payload, classId, user.user_id);
  }

  @Put('/update')
  updateQuiz(
    @Body() payload: CreateQuizBody,
    @Query('quiz_id') quizId: string,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.quizService.updateQuiz(payload, quizId, user.user_id);
  }

  @Delete()
  deleteQuiz(
    @Query('quiz_id') quizId: string,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.quizService.deleteQuiz(quizId, user.user_id);
  }

  @Post('/submit')
  submitQuiz(
    @Body() payload: SubmitQuizDto,
    @Query('quiz_id') quizId: string,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.quizService.createSubmitResult(payload, quizId, user.user_id);
  }
}
