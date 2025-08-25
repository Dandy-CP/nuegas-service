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
import { GetUser } from '../auth/decorator/user.decorator';
import { JWTPayloadUser } from '../auth/types/auth.type';
import {
  CreateAssignmentBody,
  CreateSubmissionResultBody,
  GivePointBody,
  UpdateAssignmentStatusBody,
} from './dto/payload.dto';
import { QueryPagination } from '../prisma/dto/pagination.dto';

@Controller('assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Get()
  getAssignmentList(
    @Query('class_id') classId: string,
    @Query() query: QueryPagination,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.assignmentService.getClassAssignment(
      classId,
      query,
      user.user_id,
    );
  }

  @Get('/detail')
  getAssignmentDetail(
    @Query('assignment_id') assignmentId: string,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.assignmentService.getAssignmentDetail(
      assignmentId,
      user.user_id,
    );
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
    return this.assignmentService.updateAssignment(
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
    return this.assignmentService.deleteAssignment(assignmentId, user.user_id);
  }

  @Put('/status')
  updateAssignmentStatus(
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

  @Get('/my-result-list')
  getSubmissionResultList(
    @GetUser() user: JWTPayloadUser,
    @Query() query: QueryPagination,
  ) {
    return this.assignmentService.getUserSubmissionResultList(
      user.user_id,
      query,
    );
  }

  @Get('/all-member-result')
  getAllMemberResult(
    @Query('assignment_id') assignmentId: string,
    @GetUser() user: JWTPayloadUser,
    @Query() query: QueryPagination,
  ) {
    return this.assignmentService.getAllMemberResult(
      assignmentId,
      user.user_id,
      query,
    );
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
