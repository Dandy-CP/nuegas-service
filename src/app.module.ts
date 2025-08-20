import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ClassModule } from './class/class.module';
import { PostModule } from './post/post.module';
import { JwtModule } from '@nestjs/jwt';
import { AssignmentModule } from './assignment/assignment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRED,
      },
    }),
    PrismaModule,
    AuthModule,
    ClassModule,
    PostModule,
    AssignmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
