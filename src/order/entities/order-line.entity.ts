import { ProductOrmEntity } from "src/product/entities/product.entity";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from "typeorm";
import { OrderOrmEntity } from "./order.entity";

@Entity("order_lines")
export class OrderLineOrmEntity {
    @PrimaryColumn("uuid")
    id: string;

    @ManyToOne(() => ProductOrmEntity, (product) => product.orderLines)
    @JoinColumn({ name: "product_id" })
    product: ProductOrmEntity;

    @ManyToOne(() => OrderOrmEntity, (order) => order.orderLines, {
         orphanedRowAction: 'delete',
    })
    @JoinColumn({ name: "order_id" })
    order: OrderOrmEntity;

    @Column({ type: "int" })
    price: number;

    @Column({ name: "total_qty" })
    totalQty: number;
}