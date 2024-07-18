import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [CardsController],
  imports: [NatsModule],
})
export class CardsModule {}
