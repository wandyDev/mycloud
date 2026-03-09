import { Module } from '@nestjs/common';
import { SocketAgentService } from './services/socketAgent.service';
import { SocketClientService } from './services/client.service';
import { AgentGateway } from './gateways/agent.gateway';
import { ClientGateway } from './gateways/client.gateway';
import { DatabaseModule } from 'src/database/dataabase.module';
@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [
    AgentGateway,
    ClientGateway,
    SocketAgentService,
    SocketClientService,
  ],
})
export class SocketModule {}
