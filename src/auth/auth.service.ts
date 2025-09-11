import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import {
  AcceptInvitationBodyDTO,
  SignInBodyDTO,
  SignUpBodyDTO,
} from './dto/auth.dto';

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

  async acceptInvitation(payload: AcceptInvitationBodyDTO) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token: payload.token },
      include: {
        class: true,
      },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found or expired');
    }

    if (invitation.expires_at < new Date()) {
      await this.prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: 'expired' },
      });

      throw new BadRequestException('Invitation expired');
    }

    const createdUser = await this.signUp({
      name: payload.name,
      email: payload.email,
      password: payload.password,
    });

    await this.prisma.classMember.create({
      data: {
        class_code: invitation.class.class_code,
        user_id: createdUser.data.user_id,
      },
    });

    const groupChatInDB = await this.prisma.groupChat.findFirst({
      where: {
        class_id: invitation.class_id,
      },
    });

    // Join group chat when user accept invitation class
    if (groupChatInDB) {
      await this.prisma.groupChatUser.create({
        data: {
          group_chat_id: groupChatInDB.group_chat_id,
          user_id: createdUser.data.user_id,
        },
      });
    }

    await this.prisma.invitation.delete({
      where: { id: invitation.id },
    });

    return {
      message: 'Invitation accepted',
      data: createdUser,
    };
  }

  async getLoggedInUserData(userId: string) {
    return await this.prisma.user.findUnique({
      where: {
        user_id: userId,
      },
      omit: {
        password: true,
        totp_secret: true,
        created_at: true,
        updated_at: true,
      },
    });
  }
}
