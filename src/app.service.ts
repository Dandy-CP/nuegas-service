import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async index() {
    try {
      const checkDatabase = await this.prisma.$queryRaw`SELECT 1`;
      const statusDatabase = checkDatabase ? 'Running' : 'Error';

      return {
        message: 'Welcome to nuegas',
        database: statusDatabase,
      };
    } catch (error: any) {
      return {
        message: 'Welcome to nuegas',
        database: 'Error',
        error: error.message,
      };
    }
  }
}
