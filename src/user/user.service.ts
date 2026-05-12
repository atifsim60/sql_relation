import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserOrmEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { AttachUserDto } from './dto/attach-user.dto';
import { PromoService } from 'src/promo/promo.service';
import { UserDetailsOrmEntity } from './entities/user-details.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,

    @InjectRepository(UserDetailsOrmEntity)
    private readonly userDetailsRepo: Repository<UserDetailsOrmEntity>,

    @Inject(forwardRef(() => PromoService))
    private readonly promoService: PromoService
  ) {

  }


  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create({
      id: uuidv7(),
      name: createUserDto.name,
      email: createUserDto.email,
      userDetails: {
        id: uuidv7(),
        ...createUserDto.details,
      },
    });

    return await this.userRepo.save(user);
  }

  async findAll() {
    const users = await this.userRepo.find()

    if (true) {

      for (const user of users) {
        user.userDetails = await user.userDetails;
      }
    }

    return users
  }

  async findOne(id: string) {
    return await this.userRepo.findOne({
      where: { id },
      relations: ["userDetails"]
    })
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException("user not found");
    }

    if (updateUserDto.email !== undefined) {
      user.email = updateUserDto.email;
    }

    if (updateUserDto.name !== undefined) {
      user.name = updateUserDto.name;
    }

    const details = updateUserDto.details;

    if (details) {

      const existingDetails = await user.userDetails;

      if (existingDetails) {
        existingDetails.gender = details.gender;
        existingDetails.photo = details.photo;
      } else {
        user.userDetails = Promise.resolve(
          this.userDetailsRepo.create({
            id: uuidv7(),
            ...details,
          }),
        ) as any;
      }
    }

    return this.userRepo.save(user);
  }


  async remove(id: string) {

    return await this.userRepo.delete({ id })
  }



  async attachUser(userId: string, dto: AttachUserDto) {

    const userExist = await this.userRepo.findOne({
      where: { id: userId },
      relations: ["promos"]
    })

    if (!userExist) {
      throw new BadRequestException("user not found")
    }

    const promos = await Promise.all(
      dto.promos.map((promo) => {
        return this.promoService.findOne(promo)
      })
    )


    userExist.promos = [
      ...userExist.promos,
      ...promos.filter(c => c !== null)
    ]


    return await this.userRepo.save(userExist)
  }


  async removeDetails(id: string) {
    const userExist = await this.userRepo.findOne({ where: { id } })


    if (!userExist) {
      throw new NotFoundException("user not found")
    }


    await this.userRepo.manager.delete(
      UserDetailsOrmEntity,
      id,
    );

    return await this.userRepo.save(userExist)
  }
}
