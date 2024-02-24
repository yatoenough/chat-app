import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server } from 'socket.io';
import { Request, UseGuards } from '@nestjs/common';
import { WsAuthGuard } from 'src/shared/guards/ws.auth.guard';

@WebSocketGateway()
export class MessagesGateway {
  constructor(private readonly messagesService: MessagesService) {}

  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('createMessage')
  async createMessage(@MessageBody() createMessageDto: CreateMessageDto) {
    const message = await this.messagesService.create(createMessageDto);
    this.server.emit('message', message);
    return message;
  }

  @SubscribeMessage('join')
  @UseGuards(WsAuthGuard)
  async join(@MessageBody() message: string, @Request() req: any) {
    this.server.emit('join', {
      username: req.handshake.headers.user.username,
      message: message,
    });
  }
}
