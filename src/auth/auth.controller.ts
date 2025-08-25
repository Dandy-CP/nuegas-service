import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import {
  SignUpBodyDTO,
  SignInBodyDTO,
  AcceptInvitationBodyDTO,
} from './dto/auth.dto';
import { GetUser } from './decorator/user.decorator';
import { JWTPayloadUser } from './types/auth.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/logged-user')
  getLoggedInUser(@GetUser() user: JWTPayloadUser) {
    return user;
  }

  @Public()
  @Post('/signin')
  signIn(@Body() payload: SignInBodyDTO) {
    return this.authService.signIn(payload);
  }

  @Public()
  @Post('/signup')
  signUp(@Body() payload: SignUpBodyDTO) {
    return this.authService.signUp(payload);
  }

  @Public()
  @Post('/accept-invitation')
  acceptInvitationClass(@Body() payload: AcceptInvitationBodyDTO) {
    return this.authService.acceptInvitation(payload);
  }
}
