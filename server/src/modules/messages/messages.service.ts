import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { extractToken } from '../../shared/functions/extractToken';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private readonly repo: Repository<Message>,
    private readonly jwtService: JwtService,
  ) {}

  async create(user: User, dto: CreateMessageDto): Promise<Message> {
    const newMessage = this.repo.create(dto);
    newMessage.name = user.username;
    return await this.repo.save(newMessage);
  }

  async findAll(): Promise<Message[]> {
    return await this.repo.find();
  }

  async verifyUser(bearerToken: string): Promise<User> {
    const token = bearerToken.split(' ')[1];
    const user: User = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
    return user;
  }
}
