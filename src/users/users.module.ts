import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { NatsModule } from 'src/transports/nats.module';
import { LogginService } from 'src/logging/logtail.service';

@Module({
  controllers: [UsersController],
  imports: [NatsModule],
  providers: [LogginService],  
})
export class UsersModule {}
