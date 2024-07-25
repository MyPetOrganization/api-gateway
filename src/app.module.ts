import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CardsModule } from './cards/cards.module';
import { NatsModule } from './transports/nats.module';
import { AuthModule } from './auth/auth.module';
import { LogginService } from './logging/logtail.service';
import { ProductsModule } from './products/products.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [UsersModule, CardsModule, NatsModule, AuthModule, ProductsModule, ChatModule],
  providers: [LogginService],
})
export class AppModule {}
