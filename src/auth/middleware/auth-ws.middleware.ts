import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void;

export const AuthWsMiddleware = (jwtService: JwtService): SocketMiddleware => {
  return async (socket: Socket, next) => {
    try {
      const authHeader = socket.handshake.headers.authorization;

      if (!authHeader) {
        throw new Error('Missing Authorization header');
      }

      const token = authHeader.split(' ')[1];

      try {
        const payload = await jwtService.verifyAsync(token);
        socket.data.user = payload;
      } catch (error) {
        console.log(error);
        throw new Error('Authorization token is invalid');
      }

      next();
    } catch (error) {
      console.log(error);
      next(new Error('Unauthorized'));
    }
  };
};
