import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { JWTPayloadUser } from 'src/auth/types/auth.type';
import {
  CreateAssignmentBody,
  CreateSubmissionResultBody,
  GivePointBody,
  UpdateAssignmentStatusBody,
} from './dto/payload.dto';

@Controller('assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Get()
  getAssignmentList(@Query('class_id') classId: string) {
    return this.assignmentService.getClassAssignment(classId);
  }

  @Get('/detail')
  getAssignmentDetail(@Query('assignment_id') assignmentId: string) {
    return this.assignmentService.getAssignmentDetail(assignmentId);
  }

  @Post()
  createAssignment(
    @Body() payload: CreateAssignmentBody,
    @Query('class_id') classId: string,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.assignmentService.createAssignment(
      payload,
      classId,
      user.user_id,
    );
  }

  @Put()
  updateAssignment(
    @Body() payload: CreateAssignmentBody,
    @Query('assignment_id') assignmentId: string,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.assignmentService.updateAssigment(
      payload,
      assignmentId,
      user.user_id,
    );
  }

  @Delete()
  deleteAssignment(
    @Query('assignment_id') assignmentId: string,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.assignmentService.deleteAssigment(assignmentId, user.user_id);
  }

  @Put('/status')
  updateAssigmentStatus(
    @Body() payload: UpdateAssignmentStatusBody,
    @Query('assignment_id') assignmentId: string,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.assignmentService.updateAssignmentStatus(
      payload,
      assignmentId,
      user.user_id,
    );
  }

  @Get('/result')
  getSubmissionResultList(@GetUser() user: JWTPayloadUser) {
    return this.assignmentService.getSubmissionResultList(user.user_id);
  }

  @Get('/result-detail')
  getSubmissionResultDetail(@Query('result_id') resultId: string) {
    return this.assignmentService.getSubmissionResultDetail(resultId);
  }

  @Post('/result')
  createSubmissionResult(
    @Body() payload: CreateSubmissionResultBody,
    @Query('assignment_id') assignmentId: string,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.assignmentService.createSubmissionResult(
      payload,
      assignmentId,
      user.user_id,
    );
  }

  @Put('/result')
  updateSubmissionResult(
    @Body() payload: CreateSubmissionResultBody,
    @Query('assignment_id') assignmentId: string,
    @Query('result_id') resultId: string,
  ) {
    return this.assignmentService.updateSubmissionResult(
      payload,
      assignmentId,
      resultId,
    );
  }

  @Post('/result-point')
  giveSubmissionPoint(
    @Body() payload: GivePointBody,
    @Query('assignment_id') assignmentId: string,
    @Query('result_id') resultId: string,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.assignmentService.giveSubmissionResultPoint(
      payload,
      assignmentId,
      resultId,
      user.user_id,
    );
  }
}
