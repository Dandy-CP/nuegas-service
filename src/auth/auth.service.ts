import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInBodyDTO, SignUpBodyDTO } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(payload: SignInBodyDTO) {
    const userInDB = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    const isPasswordMatch = await bcrypt.compare(
      payload.password,
      userInDB ? userInDB.password : '',
    );

    if (!userInDB || !isPasswordMatch) {
      throw new UnauthorizedException('Wrong email or password');
    }

    if (userInDB.is_2fa_active) {
      return {
        message: '2FA is enabled please validate',
        userId: userInDB.user_id,
      };
    }

    const jwtPayload = {
      sub: userInDB.user_id,
      user_id: userInDB.user_id,
      name: userInDB.name,
      email: userInDB.email,
      is_2fa_active: userInDB.is_2fa_active,
    };

    const access_token = await this.jwtService.signAsync(jwtPayload);
    const refresh_token = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRED,
    });

    return {
      message: 'Success login',
      name: userInDB.name,
      email: userInDB.email,
      access_token,
      refresh_token,
    };
  }

  async signUp(payload: SignUpBodyDTO) {
    const userInDB = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (userInDB) {
      throw new UnprocessableEntityException('User has been registered');
    }

    const salt = await bcrypt.genSalt(10);
    const hashValue = await bcrypt.hash(payload.password, salt);

    const createdValue = await this.prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashValue,
      },
    });

    return {
      message: 'Success Register new account',
      data: createdValue,
    };
  }
}
