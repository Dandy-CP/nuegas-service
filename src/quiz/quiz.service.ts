import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClassService } from '../class/class.service';
import { CreateQuizBody, SubmitQuizDto } from './dto/payload.dto';
import { QueryPagination } from '../prisma/dto/pagination.dto';

@Injectable()
export class QuizService {
  constructor(
    private prisma: PrismaService,
    private classService: ClassService,
  ) {}

  async getClassQuizList(
    classId: string,
    queryPage: QueryPagination,
    userId: string,
  ) {
    await this.classService.isMemberInClass(userId);

    const [data, meta] = await this.prisma
      .extends()
      .classQuiz.paginate({
        where: {
          class_id: classId,
        },
        omit: {
          class_id: true,
          user_id: true,
          topic_id: true,
        },
      })
      .withPages({
        page: queryPage.page,
        limit: queryPage.limit,
      });

    return { data, meta };
  }

  async getClassQuizDetail(quizId: string, userId: string) {
    await this.classService.isMemberInClass(userId);

    const classQuizInDB = await this.prisma.classQuiz.findUnique({
      where: {
        quiz_id: quizId,
      },
      include: {
        quiz_content: {
          include: {
            options: {
              select: {
                option_id: true,
                text: true,
              },
            },
          },
          omit: {
            quiz_id: true,
          },
        },
        comment: true,
      },
      omit: {
        class_id: true,
        user_id: true,
        topic_id: true,
      },
    });

    if (!classQuizInDB) throw new NotFoundException('Quiz not found');

    return classQuizInDB;
  }

  async getMemberResultQuiz(userId: string, quizId: string) {
    const existingResult = await this.prisma.quizResult.findUnique({
      where: {
        user_id_quiz_id: {
          user_id: userId,
          quiz_id: quizId,
        },
      },
      include: {
        quiz: {
          select: {
            quiz_id: true,
            title: true,
            description: true,
            attachment: true,
            is_available: true,
          },
        },
        answers: {
          select: {
            option: true,
          },
        },
        comment: true,
      },
      omit: {
        user_id: true,
        quiz_id: true,
      },
    });

    if (!existingResult) throw new NotFoundException('Result not found');

    return existingResult;
  }

  async getAllMemberResultQuiz(
    quizId: string,
    queryPage: QueryPagination,
    userId: string,
  ) {
    await this.classService.isUserOwnerClass(userId);

    const [data, meta] = await this.prisma
      .extends()
      .quizResult.paginate({
        where: {
          quiz_id: quizId,
        },
        include: {
          user: {
            select: {
              user_id: true,
              name: true,
            },
          },
        },
        omit: {
          user_id: true,
          quiz_id: true,
        },
      })
      .withPages({
        page: queryPage.page,
        limit: queryPage.limit,
      });

    return {
      data,
      meta,
    };
  }

  async createQuiz(payload: CreateQuizBody, classId: string, userId: string) {
    const classInDB = await this.prisma.class.findUnique({
      where: {
        class_id: classId,
      },
    });

    if (!classInDB) throw new NotFoundException('Class not found');

    await this.classService.isUserOwnerClass(userId);

    return await this.prisma.classQuiz.create({
      data: {
        title: payload.title,
        description: payload.description,
        attachment: payload.attachment,
        start_date: payload.start_date,
        due_date: payload.due_date,
        quiz_content: {
          create: payload.quiz_content.map((value) => ({
            question: value.question,
            attachment: value.attachment,
            options: {
              create: value.options.map((opt) => ({
                text: opt.text,
                is_correct: opt.is_correct,
              })),
            },
          })),
        },
        topic: {
          connect: {
            topic_id: payload.topic,
          },
        },
        class: {
          connect: {
            class_id: classId,
          },
        },
        user: {
          connect: {
            user_id: userId,
          },
        },
      },
      include: {
        quiz_content: {
          include: { options: true },
        },
      },
    });
  }

  async updateQuiz(payload: CreateQuizBody, quizId: string, userId: string) {
    const quizInDB = await this.prisma.classQuiz.findUnique({
      where: {
        quiz_id: quizId,
      },
      include: {
        class: true,
      },
    });

    if (!quizInDB) throw new NotFoundException('Quiz not found');

    await this.classService.isUserOwnerClass(userId);

    return await this.prisma.classQuiz.update({
      where: {
        quiz_id: quizId,
      },
      data: {
        title: payload.title,
        description: payload.description,
        attachment: payload.attachment,
        start_date: payload.start_date,
        due_date: payload.due_date,
        quiz_content: {
          deleteMany: {}, // delete all old content and replace with new
          create: payload.quiz_content.map((value) => ({
            question: value.question,
            attachment: value.attachment,
            options: {
              create: value.options.map((opt) => ({
                text: opt.text,
                is_correct: opt.is_correct,
              })),
            },
          })),
        },
        topic: {
          connect: {
            topic_id: payload.topic,
          },
        },
      },
      include: {
        quiz_content: {
          include: { options: true },
        },
      },
    });
  }

  async deleteQuiz(quizId: string, userId: string) {
    const quizInDB = await this.prisma.classQuiz.findUnique({
      where: {
        quiz_id: quizId,
      },
      include: {
        class: true,
      },
    });

    if (!quizInDB) throw new NotFoundException('Quiz not found');

    await this.classService.isUserOwnerClass(userId);

    await this.prisma.classQuiz.delete({
      where: { quiz_id: quizId },
    });

    return {
      message: 'Success delete quiz',
    };
  }

  async createSubmitResult(
    payload: SubmitQuizDto,
    quizId: string,
    userId: string,
  ) {
    await this.classService.isMemberInClass(userId);

    const quizInDB = await this.prisma.classQuiz.findUnique({
      where: {
        quiz_id: quizId,
      },
      include: {
        class: true,
        quiz_content: {
          include: { options: true },
        },
      },
    });

    if (!quizInDB) throw new NotFoundException('Quiz not found');

    const existingResult = await this.prisma.quizResult.findUnique({
      where: {
        user_id_quiz_id: {
          user_id: userId,
          quiz_id: quizId,
        },
      },
    });

    if (existingResult)
      throw new UnprocessableEntityException('User has been submit quiz');

    const totalQuestions = quizInDB.quiz_content.length;
    if (totalQuestions === 0) throw new Error('Quiz has no questions');

    const pointPerQuestion = 100 / totalQuestions;
    let totalScore = 0;

    for (const answer of payload.answers) {
      const content = quizInDB.quiz_content.find(
        (value) => value.quiz_content_id === answer.quiz_content_id,
      );

      if (!content) continue;

      const option = content.options.find(
        (value) => value.option_id === answer.selected_option_id,
      );

      if (!option) continue;

      if (option.is_correct) {
        totalScore += pointPerQuestion;
      }
    }

    totalScore = Math.min(totalScore, 100);

    const result = await this.prisma.quizResult.create({
      data: {
        user_id: userId,
        quiz_id: quizId,
        point: Math.round(totalScore),
        answers: {
          create: payload.answers.map((value) => ({
            quiz_content_id: value.quiz_content_id,
            option_id: value.selected_option_id,
          })),
        },
      },
      include: { answers: true },
    });

    return result;
  }
}
