import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { UserOrmEntity } from './user/entities/user.entity';
import { UserDetailsOrmEntity } from './user/entities/user-details.entity';
import { ProductModule } from './product/product.module';
import { ProductOrmEntity } from './product/entities/product.entity';
import { OrderModule } from './order/order.module';
import { OrderOrmEntity } from './order/entities/order.entity';
import { OrderLineOrmEntity } from './order/entities/order-line.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'myapp',
      entities: [
        UserOrmEntity,
        UserDetailsOrmEntity,
        ProductOrmEntity,
        OrderOrmEntity,
        OrderLineOrmEntity
      ],
      synchronize: true,
    }),
    UserModule,
    ProductModule,
    OrderModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
