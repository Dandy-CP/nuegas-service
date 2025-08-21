import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicBody } from './dto/payload.dto';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get()
  getClassTopicList(@Query('class_id') classId: string) {
    return this.topicService.getClassTopic(classId);
  }

  @Post()
  createClassTopic(
    @Body() payload: CreateTopicBody,
    @Query('class_id') classId: string,
  ) {
    return this.topicService.createClassTopic(payload, classId);
  }

  @Put()
  updateClassTopic(
    @Body() payload: CreateTopicBody,
    @Query('topic_id') topicId: string,
  ) {
    return this.topicService.updateClassTopic(payload, topicId);
  }

  @Delete()
  deleteClassTopic(@Query('topic_id') topicId: string) {
    return this.topicService.deleteClassTopic(topicId);
  }
}
