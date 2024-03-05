import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { extractToken } from '../functions/extractToken';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handshake = context.switchToWs().getClient().handshake;
    const token = extractToken(handshake);

    if (!token) {
      throw new WsException('Unauthorized');
    }
    try {
      await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (ex) {
      throw new WsException('Unauthorized');
    }
    return true;
  }
}
