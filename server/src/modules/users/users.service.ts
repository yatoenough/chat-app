import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const newUser = this.repository.create(dto);
    return await this.repository.save(newUser);
  }

  async getAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async getByEmail(email: string): Promise<User | undefined> {
    return await this.repository.findOneBy({ email });
  }

  async update(email: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.getByEmail(email);
    Object.assign(user, dto);
    return user;
  }

  async deleteById(id: string): Promise<User> {
    const user = await this.repository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User by id ${id} not found.`);
    return this.repository.remove(user);
  }
}
