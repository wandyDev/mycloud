import { Module } from '@nestjs/common';
import { SocketModule } from './modules/socket/socket.module';
import { AuthModule } from './modules/auth/auth.module';
import { ServersModule } from './modules/servers/servers.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    SocketModule,
    AuthModule,
    ServersModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
})
export class AppModule {}
