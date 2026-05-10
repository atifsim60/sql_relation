import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';
import { v7 as uuidV7} from "uuid"
import { InjectRepository } from '@nestjs/typeorm';
import { OrderOrmEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderLineOrmEntity } from './entities/order-line.entity';

@Injectable()
export class OrderService {


  constructor(
    
    private readonly productService : ProductService,
    private readonly userService :UserService,

    @InjectRepository(OrderOrmEntity) 
    private readonly orderRepo : Repository<OrderOrmEntity>,

      @InjectRepository(OrderLineOrmEntity) 
    private readonly orderLineRepo : Repository<OrderLineOrmEntity>
  ){}



 async create(createOrderDto: CreateOrderDto) {

  const userExist = await this.userService.findOne(createOrderDto.user)

  if(!userExist) throw new NotFoundException("user does not exist")


    const products = await Promise.all(
      createOrderDto.lines.map((line)=>{
        return this.productService.findOne(line.product)
      })
    )


 const order = this.orderRepo.create({
  id: uuidV7(),
  user: userExist,
  totalPrice: 100,
});

order.orderLines = products.map((product) => {
  if (!product) {
    throw new NotFoundException("Product not found");
  }

  if (product.price == null) {
    throw new BadRequestException("Invalid product price");
  }

  return this.orderLineRepo.create({
    id: uuidV7(),
    product: product,
    price: product.price,
    totalQty: 1,
    order: order,
  });
});

return this.orderRepo.save(order);

  }

  async findAll() {
    return await this.orderRepo.find()
  }

  async findOne(id: string) {
    return await this.orderRepo.findOne({where:{id}})
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
