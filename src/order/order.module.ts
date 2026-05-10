import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderOrmEntity } from './entities/order.entity';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { OrderLineOrmEntity } from './entities/order-line.entity';

@Module({
  imports:[ProductModule,
    UserModule,
    TypeOrmModule.forFeature([
      OrderOrmEntity,
      OrderLineOrmEntity
    ])
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
