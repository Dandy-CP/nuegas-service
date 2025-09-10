import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorator/user.decorator';
import { JWTPayloadUser } from '../auth/types/auth.type';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/my-task')
  getMyTask(@GetUser() user: JWTPayloadUser) {
    return this.userService.getMyTask(user.user_id);
  }
}
