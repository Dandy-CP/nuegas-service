import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'ws') {
      return false; // Only for WebSocket contexts
    }

    const client = context.switchToWs().getClient<Socket>();
    const token = client.handshake.headers.authorization;

    if (!token) {
      throw new WsException('Unauthorized');
    }

    // Verify Bearer token
    const payload = await this.jwtService
      .verifyAsync(token.split(' ')[1], {
        secret: process.env.JWT_SECRET,
      })
      .catch((error) => {
        throw new WsException(`Token not valid ${error.message}`);
      });

    client.data.user = payload;
    return true;
  }
}
