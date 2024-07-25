import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { connect, StringCodec } from 'nats';
import { envs } from 'src/config';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer() server: Server;
  private natsClient: any;

  constructor() {
    this.connectToNATS();
  }

  async connectToNATS() {
    this.natsClient = await connect({ servers: envs.natsServers });
  }

  @SubscribeMessage('event_message')
  handleIncomingMessage(client: any, payload: { message: string; username: string }): void {
    this.server.emit('event_message', payload);
  }
}
