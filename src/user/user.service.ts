import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserOrmEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { AttachUserDto } from './dto/attach-user.dto';
import { PromoService } from 'src/promo/promo.service';

@Injectable()
export class UserService {

  constructor(
   @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,

       @Inject(forwardRef(() => PromoService))
        private readonly promoService: PromoService
  ){

  }


  async create(createUserDto: CreateUserDto) {
  
    const body = {
      id: uuidv7(),
      name: createUserDto.name,
      email: createUserDto.email,
      userDetails:{
         id: uuidv7(),
         ...createUserDto.details
      }
    }

    return await this.userRepo.save(body)
  }

  async findAll() {
    const users =  await this.userRepo.find()

    if(true){
     
for (const user of users) {
  user.userDetails = await user.userDetails;
}
    }

    return users
  }

  async  findOne(id: string) {
    return await this.userRepo.findOne({where:{id},
    relations:["userDetails"]})
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }



  async attachUser(userId: string, dto:AttachUserDto){
   
    const  userExist = await  this.userRepo.findOne({where:{id:userId},
    relations:["promos"]})

    if(!userExist){
        throw new BadRequestException("user not found")
    }

    const promos  = await Promise.all(
      dto.promos.map((promo)=>{
        return this.promoService.findOne(promo)
      })
    )
    

    userExist.promos=[
      ...userExist.promos,
      ...promos.filter(c => c !==null)
    ]


    return await this.userRepo.save(userExist)
  }
}
