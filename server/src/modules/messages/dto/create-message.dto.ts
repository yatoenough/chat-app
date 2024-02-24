import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  text: string;
}
