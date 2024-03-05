import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/user.entity';

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
    const payload = this.createPayload(user);

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signIn(dto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.usersService.getByEmail(dto.email);
    if (user?.password !== dto.password) {
      throw new UnauthorizedException();
    }
    const payload = this.createPayload(user);
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private createPayload(user: User) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }
}
