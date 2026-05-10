import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './entities/user.entity';
import { UserDetailsOrmEntity } from './entities/user-details.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      UserOrmEntity,UserDetailsOrmEntity
    ])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
