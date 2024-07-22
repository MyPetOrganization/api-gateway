import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CardsModule } from './cards/cards.module';
import { NatsModule } from './transports/nats.module';
import { AuthModule } from './auth/auth.module';
import { LogginService } from './logging/logtail.service';

@Module({
  imports: [UsersModule, CardsModule, NatsModule, AuthModule,],
  providers: [LogginService],
})
export class AppModule {}
