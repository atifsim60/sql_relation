import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { v7 as uuidV7} from "uuid"
import { InjectRepository } from '@nestjs/typeorm';
import { ProductOrmEntity } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {


  constructor(
    @InjectRepository(ProductOrmEntity)

    private readonly productRepo : Repository<ProductOrmEntity>
  ){

  }

  async create(createProductDto: CreateProductDto) {

    const body = {
      id: uuidV7(),
      ...createProductDto
    }
    return await this.productRepo.save(body)
  }

  async findAll() {
    return await this.productRepo.find()
  }

  async findOne(id: string) {
    return await this.productRepo.findOne({where:{id}})
  
  }

  async getProductsByOrderId(orderId:string){
    const products = await this.productRepo
    .createQueryBuilder('product')

    .leftJoin('product.orderLines', 'orderLine')

    .leftJoin('orderLine.order', 'order')

    .where('order.id = :orderId', {
      orderId,
    })

    .getMany();

    return products
  }
 
}
