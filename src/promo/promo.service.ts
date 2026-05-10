import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PromoOrmEntity } from './entities/promo.entity';
import { Repository } from 'typeorm';
import {v7 as uuidV7} from "uuid"
import { AttachPromoDto } from './dto/attach-promo.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PromoService {

  constructor(

    @InjectRepository(PromoOrmEntity)
    private readonly promoRepo : Repository<PromoOrmEntity>,
     @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ){}



 async create(createPromoDto: CreatePromoDto) {

  const duplicatePromoExist = await this.promoRepo.findOne({where:{code:createPromoDto.code}})


  if(duplicatePromoExist) throw new BadRequestException("duplicate promo found")
  
    const body = {
      id: uuidV7(),
      ...createPromoDto
    }

    return await this.promoRepo.save(body)
  }

 async findAll() {
    return await this.promoRepo.find()
  }

  async findOne(id: string) {
    return await this.promoRepo.findOne({where:{id}})
  }

  update(id: number, updatePromoDto: UpdatePromoDto) {
    return `This action updates a #${id} promo`;
  }

  remove(id: number) {
    return `This action removes a #${id} promo`;
  }


  async attachPromo(id: string, dto:AttachPromoDto){
   
    const promoExist = await this.promoRepo.findOne({where:{id}})


    if(!promoExist){
      throw new NotFoundException("promo not found")
    }

    const users = (await Promise.all(
  dto.userIds.map((id) => {
    return this.userService.findOne(id);
  })
)).filter((c) => c !== null);


    if(!users.length){
      throw new BadRequestException("users not found")
    }


    promoExist.users = users


    return await this.promoRepo.save(promoExist)

  }
}
