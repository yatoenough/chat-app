import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from '../users/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private readonly repo: Repository<Message>,
  ) {}

  async create(user: User, dto: CreateMessageDto): Promise<Message> {
    const newMessage = this.repo.create(dto);
    newMessage.name = user.username;
    return await this.repo.save(newMessage);
  }

  async findAll(): Promise<Message[]> {
    return await this.repo.find();
  }
}
