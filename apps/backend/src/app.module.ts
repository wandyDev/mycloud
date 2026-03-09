import { Module } from '@nestjs/common';
import { SocketModule } from './modules/socket/socket.module';
import { AuthModule } from './modules/auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
@Module({
  imports: [
    SocketModule,
    AuthModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
  ],
})
export class AppModule {}
