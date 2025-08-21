import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTopicBody } from './dto/payload.dto';

@Injectable()
export class TopicService {
  constructor(private prisma: PrismaService) {}

  async getClassTopic(classId: string) {
    if (!classId)
      throw new UnprocessableEntityException('Query "class_id" is required');

    return await this.prisma.classTopic.findMany({
      where: {
        class_id: classId,
      },
    });
  }

  async createClassTopic(payload: CreateTopicBody, classId: string) {
    if (!classId)
      throw new UnprocessableEntityException('Query "class_id" is required');

    const classInDB = await this.prisma.class.findUnique({
      where: {
        class_id: classId,
      },
    });

    if (!classInDB) throw new NotFoundException('Class not found');

    return await this.prisma.classTopic.create({
      data: {
        name: payload.name,
        class_id: classId,
      },
    });
  }

  async updateClassTopic(payload: CreateTopicBody, topicId: string) {
    if (!topicId)
      throw new UnprocessableEntityException('Query "topic_id" is required');

    const classTopicInDB = await this.prisma.classTopic.findUnique({
      where: {
        topic_id: topicId,
      },
    });

    if (!classTopicInDB) throw new NotFoundException('Topic not found');

    return await this.prisma.classTopic.update({
      where: {
        topic_id: topicId,
      },
      data: {
        name: payload.name,
      },
    });
  }

  async deleteClassTopic(topicId: string) {
    if (!topicId)
      throw new UnprocessableEntityException('Query "topic_id" is required');

    const classTopicInDB = await this.prisma.classTopic.findUnique({
      where: {
        topic_id: topicId,
      },
    });

    if (!classTopicInDB) throw new NotFoundException('Topic not found');

    return await this.prisma.classTopic.delete({
      where: {
        topic_id: topicId,
      },
    });
  }
}
