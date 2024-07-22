import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { NatsModule } from 'src/transports/nats.module';
import { LogginService } from 'src/logging/logtail.service';

@Module({
  imports: [NatsModule],
  controllers: [AuthController],
  providers: [LogginService],
})
export class AuthModule {}
