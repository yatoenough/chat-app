import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import extractTokenFromHeader from '../functions/extractTokenFromHeader';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handshake = context.switchToWs().getClient().handshake;
    const token = extractTokenFromHeader(handshake);

    if (!token) {
      throw new WsException('Unauthorized');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      handshake.headers['user'] = payload;
    } catch (ex) {
      throw new WsException('Unauthorized');
    }
    return true;
  }
}
