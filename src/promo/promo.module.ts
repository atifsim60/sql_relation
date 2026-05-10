import { forwardRef, Module } from '@nestjs/common';
import { PromoService } from './promo.service';
import { PromoController } from './promo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromoOrmEntity } from './entities/promo.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([PromoOrmEntity]),
    forwardRef(()=>UserModule)
  ],
  controllers: [PromoController],
  providers: [PromoService],
  exports:[PromoService]
})
export class PromoModule {}
