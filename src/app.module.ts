import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ClassModule } from './class/class.module';
import { PostModule } from './post/post.module';
import { AssignmentModule } from './assignment/assignment.module';
import { TopicModule } from './topic/topic.module';
import { CommentModule } from './comment/comment.module';
import { SupabaseModule } from './supabase/supabase.module';
import { UploadModule } from './upload/upload.module';
import { QuizModule } from './quiz/quiz.module';
import { NodemailerModule } from './nodemailer/nodemailer.module';
import { CronModule } from './cron/corn.module';
import { ChatModule } from './chat/chat.module';
import { AuthGuard } from './auth/auth.guard';
import { GroupChatModule } from './group-chat/group-chat.module';

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
    SupabaseModule,
    NodemailerModule,
    CronModule,
    AuthModule,
    ClassModule,
    PostModule,
    AssignmentModule,
    TopicModule,
    CommentModule,
    UploadModule,
    QuizModule,
    ChatModule,
    GroupChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
