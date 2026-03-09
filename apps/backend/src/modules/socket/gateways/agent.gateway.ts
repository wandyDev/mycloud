import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { SocketAgentService } from '../services/socketAgent.service';
import type { AgentPayload } from '@my_cloud/types';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/agent',
})
export class AgentGateway implements OnGatewayConnection {
  constructor(private readonly socketService: SocketAgentService) {}

  @WebSocketServer()
  server: Server;
  //==================================================
  //                    HANDLE CONNECTION
  //==================================================
  async handleConnection(client: Socket) {
    const { secretToken, serverId, serverKey } = client.handshake.auth;

    // 1. Validación rápida de presencia de datos
    if (!secretToken || !serverId || !serverKey) {
      console.log(`Intento de conexión inválido desde ${client.id}`);
      client.disconnect();
      return;
    }

    try {
      //enviamos los datos del server al servicio para que verifique si esta autorizado
      const authorized = await this.socketService.isAuthorized(
        serverId,
        secretToken,
        serverKey,
      );

      if (!authorized.isAuthorized ) {
        console.log(`Server ${serverId} no autorizado`);
        client.disconnect();
        return;
      }

      // 2. Éxito: Marcamos el socket
      client.data.authorized = true;
      client.data.userId = authorized.userId;
      console.log(`Server ${serverId} conectado correctamente`);

      // LE AVISAMOS AL CLIENTE QUE YA ESTÁ VALIDADO EN LA DB
      client.emit('ready');
    } catch (error) {
      console.error('Error en validación:', error);
      client.disconnect();
    }
  }

  @SubscribeMessage('sendMetrics')
  sendMetrics(
    @MessageBody() metrics: AgentPayload,
    @ConnectedSocket() client: Socket,
  ) {
    if (!client.data.authorized) {
      client.emit('unauthorized');
      client.disconnect();
      return;
    }
    //Enviamos los datos al cliente
    this.server.of('/client').to(client.data.userId).emit('metrics', metrics);
  }
}
