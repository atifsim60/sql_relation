import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';
import { v7 as uuidV7 } from "uuid"
import { InjectRepository } from '@nestjs/typeorm';
import { OrderOrmEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderLineOrmEntity } from './entities/order-line.entity';
import { ActionEnum } from 'src/enum/action.enum';
import { UpdateOrderLineDto } from './dto/update-order-line.dto';

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
        totalQty: 1,
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


    if (updateOrderDto.action === ActionEnum.REMOVE) {

      const orderLineIds =
        updateOrderDto.lines?.map((line) => line.id) ?? [];

      orderExist.orderLines = orderExist.orderLines.filter(
        (item) => !orderLineIds.includes(item.id),
      );
    }


    if (updateOrderDto.action === ActionEnum.ADD) {

      const lines = updateOrderDto.lines ?? [];

      const products = await Promise.all(
        lines.map((line) => {
          return this.productService.findOne(line.product!);
        }),
      );

      const newOrderLines = products.map((product) => {

        if (!product) {
          throw new NotFoundException("product not found");
        }

        return this.orderLineRepo.create({
          id: uuidV7(),
          product: product,
          price: product.price,
          totalQty: 1,
          order: orderExist,
        });
      });

      orderExist.orderLines.push(...newOrderLines);
    }


    if (updateOrderDto.action === ActionEnum.UPDATE_LINE) {

      const lines = updateOrderDto.lines ?? [];

      lines.forEach((line) => {

        const orderLineExist = orderExist.orderLines.find(
          (item) => item.id === line.id,
        );

        if (!orderLineExist) {
          throw new NotFoundException(
            `order line ${line.id} not found`,
          );
        }

        if (line.totalQty != null) {
          orderLineExist.totalQty = line.totalQty;
        }
      });
    }

    return await this.orderRepo.save(orderExist);
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
