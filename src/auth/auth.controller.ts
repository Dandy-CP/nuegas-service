import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { SignUpBodyDTO, SignInBodyDTO } from './dto/auth.dto';
import { GetUser } from './decorator/user.decorator';
import { JWTPayloadUser } from './types/auth.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/logedin-user')
  getLogedInUser(@GetUser() user: JWTPayloadUser) {
    return user;
  }

  @Public()
  @Post('/signin')
  SignIn(@Body() payload: SignInBodyDTO) {
    return this.authService.signIn(payload);
  }

  @Public()
  @Post('/signup')
  SignUp(@Body() payload: SignUpBodyDTO) {
    return this.authService.signUp(payload);
  }
}
