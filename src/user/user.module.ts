import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './entities/user.entity';
import { UserDetailsOrmEntity } from './entities/user-details.entity';
import { PromoModule } from 'src/promo/promo.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      UserOrmEntity,UserDetailsOrmEntity
    ]),
    forwardRef(()=>PromoModule)
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
