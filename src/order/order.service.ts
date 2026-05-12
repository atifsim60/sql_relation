import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto, UpdateOrderLineDto } from './dto/update-order.dto';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';
import { v7 as uuidV7 } from "uuid"
import { InjectRepository } from '@nestjs/typeorm';
import { OrderOrmEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderLineOrmEntity } from './entities/order-line.entity';
import { ActionEnum } from 'src/enum/action.enum';

@Injectable()
export class OrderService {


  constructor(

    private readonly productService: ProductService,
    private readonly userService: UserService,

    @InjectRepository(OrderOrmEntity)
    private readonly orderRepo: Repository<OrderOrmEntity>,

    @InjectRepository(OrderLineOrmEntity)
    private readonly orderLineRepo: Repository<OrderLineOrmEntity>
  ) { }



  async create(createOrderDto: CreateOrderDto) {

    const userExist = await this.userService.findOne(createOrderDto.user)

    if (!userExist) throw new NotFoundException("user does not exist")


    const products = await Promise.all(
      createOrderDto.lines.map((line) => {
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
        qty: 1,
        order: order,
      });
    });

    return this.orderRepo.save(order);

  }

  async findAll() {
    return await this.orderRepo.find(
      {
        relations: {
          orderLines: {
            product: true,
          }, user: true
        },
      }
    )
  }

  async findOne(id: string) {

    return await this.orderRepo.findOne({
      where: { id }, relations: {
        orderLines: {
          product: true,
        }, user: true
      },
    })
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {

    const orderExist = await this.orderRepo.findOne({
      where: { id },
      relations: {
        orderLines: {
          product: true,
        },
      },
    });

    if (!orderExist) {
      throw new NotFoundException("order not found");
    }

    const lines = updateOrderDto.lines ?? [];

    const toDelete: string[] = [];
    const toUpdate: UpdateOrderLineDto[] = [];
    const toCreate: UpdateOrderLineDto[] = [];

    for (const line of lines) {

      if (line.id && !line.product && !line.qty) {
        if (!await this.orderLineRepo.findOne({ where: { id: line.id } })) {
          throw new NotFoundException(line.id + "line id not exist")
        }
        toDelete.push(line.id);
        continue;
      }

      if (line.id && line.qty != null) {

        if (!await this.orderLineRepo.findOne({ where: { id: line.id } })) {
          throw new NotFoundException(line.id + "line id not exist")
        }


        toUpdate.push(line);
        continue;
      }

      if (!line.id && line.product) {
        toCreate.push(line);
        continue;
      }
    }



    if (toDelete.length > 0) {
      orderExist.orderLines = orderExist.orderLines.filter(
        (line) => !toDelete.includes(line.id),
      );
    }

    for (const line of toUpdate) {

      const existing = orderExist.orderLines.find(
        (l) => l.id === line.id,
      );

      if (!existing) {
        throw new NotFoundException(`order line ${line.id} not found`);
      }

      if (line.qty != null) {
        existing.qty = line.qty;
      }
    }

    for (const line of toCreate) {

      const product = await this.productService.findOne(line.product!);

      if (!product) {
        throw new BadRequestException("product not found");
      }

      const newOrderLine = this.orderLineRepo.create({
        id: uuidV7(),
        product,
        price: product.price,
        qty: line.qty ?? 1,
        order: orderExist,
      });

      orderExist.orderLines.push(newOrderLine);
    }

    return this.orderRepo.save(orderExist);
  }


  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async getOrdersByProduct(productId: string) {
    const orders = await this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderLines', 'orderLine')
      .leftJoinAndSelect('orderLine.product', 'product')
      .leftJoin('order.user', 'user')
      .addSelect([
        // 'user.id',
        'user.name',
      ])
      .where('product.id = :productId', { productId })
      .getMany();

    return orders
  }



}
