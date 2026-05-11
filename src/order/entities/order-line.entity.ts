import { ProductOrmEntity } from "src/product/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { OrderOrmEntity } from "./order.entity";


@Entity("order_lines")
export class OrderLineOrmEntity {
    @PrimaryColumn("uuid")
    id: string


    @ManyToOne(() => ProductOrmEntity, (user) => user.orderLines, {
        eager: true
    })

    product: ProductOrmEntity;


    @ManyToOne(() => OrderOrmEntity, (order) => order.orderLines, {
        onDelete: "CASCADE",
    })
    order: OrderOrmEntity;


    @Column({ type: "int" })
    price: number


    @Column({ name: "total_qty" })
    totalQty: number

}