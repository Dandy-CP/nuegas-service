import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ClassService } from './class.service';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { JWTPayloadUser } from 'src/auth/types/auth.type';
import { CreateClassBody, InviteMemberBody } from './dto/payload.dto';
import { QueryPagination } from 'src/prisma/dto/pagination.dto';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get('/my-class')
  getMyClass(@GetUser() user: JWTPayloadUser, @Query() query: QueryPagination) {
    return this.classService.getMyClass(user.user_id, query);
  }

  @Get('/joined-class')
  getJoinedClass(
    @GetUser() user: JWTPayloadUser,
    @Query() query: QueryPagination,
  ) {
    return this.classService.getJoinedClass(user.user_id, query);
  }

  @Get('/detail')
  getDetailClass(
    @Query('class_id') classId: string,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.classService.getClassDetail(classId, user.user_id);
  }

  @Get('/member')
  getMemberClass(
    @Query('class_id') classId: string,
    @Query() query: QueryPagination,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.classService.getClassMember(classId, query, user.user_id);
  }

  @Post('/create-my-class')
  createClass(
    @Body() payload: CreateClassBody,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.classService.createMyClass(payload, user.user_id);
  }

  @Delete()
  deleteClass(
    @Query('class_id') classId: string,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.classService.deleteClass(classId, user.user_id);
  }

  @Post('/join-class')
  joinClass(
    @Query('class_code') classCode: string,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.classService.joinClass(user.user_id, classCode);
  }

  @Post('/invite')
  inviteMember(
    @Body() payload: InviteMemberBody,
    @Query('class_id') classId: string,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.classService.inviteMember(payload, classId, user.user_id);
  }

  @Delete('/member')
  deleteClassMember(
    @Query('member_id') memberId: string,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.classService.deleteClassMember(memberId, user.user_id);
  }
}
