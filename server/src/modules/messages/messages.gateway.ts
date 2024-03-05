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
@UseGuards(WsAuthGuard)
export class MessagesGateway {
  constructor(private readonly messagesService: MessagesService) {}

  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('createMessage')
  async createMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @Request() req,
  ) {
    const user = req.handshake.headers.user;
    const message = await this.messagesService.create(user, createMessageDto);
    this.server.emit('message', message);
    return message;
  }

  @SubscribeMessage('join')
  async join(@Request() req) {
    const user = req.handshake.headers.user;
    this.server.emit('message', `${user.username} joined the chat`);
  }
}
