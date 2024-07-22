import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { NatsModule } from 'src/transports/nats.module';
import { LogginService } from 'src/logging/logtail.service';

@Module({
  controllers: [CardsController],
  imports: [NatsModule],
  providers: [LogginService],
})
export class CardsModule {}
