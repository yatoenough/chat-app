import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
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
    @ConnectedSocket() client: Socket,
  ) {
    const user = await this.messagesService.verifyUserInToken(
      client.handshake.headers.authorization,
    );
    const message = await this.messagesService.create(user, createMessageDto);
    this.server.emit('message', message);
    return message;
  }

  @SubscribeMessage('join')
  async join(@ConnectedSocket() client: Socket) {
    const user = await this.messagesService.verifyUserInToken(
      client.handshake.headers.authorization,
    );
    this.server.emit('message', `${user.username} joined the chat`);
  }
}
