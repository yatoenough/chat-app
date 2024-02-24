import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: CreateUserDto): Promise<{ access_token: string }> {
    const candidate = await this.usersService.getByEmail(dto.email);
    if (candidate) {
      throw new BadRequestException();
    }

    const user = await this.usersService.create(dto);

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signIn(dto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.usersService.getByEmail(dto.email);
    if (user?.password !== dto.password) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
