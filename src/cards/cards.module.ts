import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from 'src/config';

@Module({
  controllers: [CardsController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: 'CARDS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: envs.cardsMicroserviceHost,
          port: envs.cardsMicroservicePort,
        },
      }
    ]),
  ],
})
export class CardsModule {}
