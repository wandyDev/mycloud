import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class SocketAgentService {
  constructor(private readonly databaseService: DatabaseService) {}

  //==================================================
  //                    IS AUTHORIZED
  //==================================================
  async isAuthorized(serverId: string, secretToken: string, serverKey: string) {
    //Busca el server
    const server = await this.databaseService.server.findUnique({
      where: {
        serverId: serverId,
      },
      include: {
        user: true,
      },
    });

    //Si no encuentra el server
    if (!server) return { isAuthorized: false };
    //Si no coincide el secretToken o el serverKey
    // Comparación estricta
    const isUserTokenOk = await bcrypt.compare(
      secretToken,
      server.user.secretToken,
    );
    const isServerKeyOk = await bcrypt.compare(serverKey, server.serverKey);
    //Si todo esta bien
    return {
      isAuthorized: isUserTokenOk && isServerKeyOk,
      userId: server.user.id,
    };
  }
}
