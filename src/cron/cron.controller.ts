import { Controller, Get, Param, UnauthorizedException } from '@nestjs/common';
import { Public } from '../auth/decorator/public.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('cron')
export class CronController {
  constructor(private prisma: PrismaService) {}

  @Public()
  @Get('check-expired-task/:secret')
  async handleExpireCheck(@Param('secret') secret: string) {
    if (secret !== process.env.CRON_SECRET) {
      throw new UnauthorizedException('Invalid secret');
    }

    const updatedAssignment = await this.prisma.classAssignments.updateMany({
      where: {
        due_date: { lt: new Date() },
        is_available: true,
      },
      data: { is_available: false },
    });

    const updatedQuiz = await this.prisma.classQuiz.updateMany({
      where: {
        due_date: { lt: new Date() },
        is_available: true,
      },
      data: { is_available: false },
    });

    return {
      message: 'Expired check executed',
      data: { updatedAssignment, updatedQuiz },
    };
  }
}
