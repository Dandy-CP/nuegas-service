import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ClassService } from './class.service';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { JWTPayloadUser } from 'src/auth/types/auth.type';
import { CreateClassBody, InviteMemberBody } from './dto/payload.dto';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get('/my-class')
  getMyClass(@GetUser() user: JWTPayloadUser) {
    return this.classService.getMyClass(user.user_id);
  }

  @Get('/joined-class')
  getJoinedClass(@GetUser() user: JWTPayloadUser) {
    return this.classService.getJoinedClass(user.user_id);
  }

  @Get('/detail')
  getDetailClass(@Query('class_id') classId: string) {
    return this.classService.getClassDetail(classId);
  }

  @Get('/member')
  getMemberClass(@Query('class_code') classCode: string) {
    return this.classService.getClassMember(classCode);
  }

  @Post('/create-my-class')
  createClass(
    @Body() payload: CreateClassBody,
    @GetUser() user: JWTPayloadUser,
  ) {
    return this.classService.createMyClass(payload, user.user_id);
  }

  @Delete()
  deleteClass(@Query('class_id') classId: string) {
    return this.classService.deleteClass(classId);
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
    @Query('class_code') classCode: string,
  ) {
    return this.classService.inviteMember(payload, classCode);
  }

  @Delete('/member')
  deleteClassMember(@Query('member_id') memberId: string) {
    return this.classService.deleteClassMember(memberId);
  }
}
