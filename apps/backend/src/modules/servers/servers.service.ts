import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateServerDto } from './dto/create-server.dto';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class ServersService {
  constructor(private readonly prisma: DatabaseService) {}

  //=======================================================
  //                       CREATE SERVER
  //=======================================================
  async createServer(createServerDto: CreateServerDto, userId: string) {
    const serverKey = crypto.randomUUID();
    const serverId = crypto.randomUUID();

    const server = await this.prisma.server.create({
      data: {
        ...createServerDto,
        user: {
          connect: {
            id: userId,
          },
        },
        serverId,
        serverKey,
      },
    });
    return {
      serverKey: server.serverKey,
      serverId: server.serverId,
    };
  }

  //=======================================================
  //                       FIND ALL SERVERS
  //=======================================================
  async findAllServers(userId: string) {
    const servers = await this.prisma.server.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    });
    if (!servers) {
      throw new NotFoundException('No servers found');
    }
    return servers;
  }

  //=======================================================
  //                       FIND SERVER BY ID
  //=======================================================
  async findServerById(serverId: string) {
    const server = await this.prisma.server.findUnique({
      where: {
        serverId,
      },
    });
    if (!server) {
      throw new NotFoundException('No server found');
    }
    return {
      id: server.id,
      name: server.name,
      description: server.description,
    };
  }
}
