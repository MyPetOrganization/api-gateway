import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CardsModule } from './cards/cards.module';
import { NatsModule } from './transports/nats.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, CardsModule, NatsModule, AuthModule,],
})
export class AppModule {}
