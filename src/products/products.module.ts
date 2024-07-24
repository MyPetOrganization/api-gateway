import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { LogginService } from 'src/logging/logtail.service';
import { ProductsController } from './products.controller';

@Module({
    controllers: [ProductsController],
    imports: [NatsModule],
    providers: [LogginService],
})
export class ProductsModule { }