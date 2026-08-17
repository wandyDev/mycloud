import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { SocketClientService } from '../services/client.service';
import type { AgentPayload } from '@my_cloud/types';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { ValidateTokenGuard } from '../../auth/guards/validate-token/validate-token.guard';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/client',
})
@UseGuards(ValidateTokenGuard)
export class ClientGateway implements OnGatewayConnection {
  constructor(private readonly socketService: SocketClientService) {}

  @WebSocketServer()
  server!: Server;

  async handleConnection(client: Socket) {
    const ticket = client.handshake.auth.ticket;
    if (!ticket) {
      console.log(`Intento de conexión inválido desde ${client.id}`);
      client.disconnect();
      return;
    }
    try {
      const isTicketValid = await this.socketService.isTicketValid(ticket);
      if (!isTicketValid) {
        console.log(`Intento de conexión inválido desde ${client.id}`);
        client.disconnect();
        return;
      }
      // 2. Éxito: Marcamos el socket
      client.data.authorized = true;
      client.join(isTicketValid.userId);
      console.log(`Client ${isTicketValid.userId} conectado correctamente`);
    } catch (error) {
      console.error('Error en validación:', error);
      client.disconnect();
    }
  }

  @SubscribeMessage('findMetrics')
  findMetrics(
    @MessageBody() metrics: AgentPayload,
    @ConnectedSocket() client: Socket,
  ) {
    client.emit('metrics', metrics);
    console.log(metrics);
  }
}
