import { OrderLineOrmEntity } from "src/order/entities/order-line.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity("product")
export class ProductOrmEntity {
    @PrimaryColumn('uuid')
    id: string;


    @Column()
    title: string

    @Column({type:"int"})
    price: number


    @OneToMany(() => OrderLineOrmEntity, (orderLine) => orderLine.product)
    orderLines: OrderLineOrmEntity[]
}
