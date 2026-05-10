import { UserOrmEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { OrderLineOrmEntity } from "./order-line.entity";


@Entity("orders")
export class OrderOrmEntity {
    @PrimaryColumn("uuid")
    id: string;


   @ManyToOne(() => UserOrmEntity, (user) => user.orders)
@JoinColumn({ name: "user_id" })
user: UserOrmEntity;


    @Column({type:"int"})
    totalPrice:number


    @OneToMany(() => OrderLineOrmEntity, (order) => order.order,{
        cascade:true,
        eager:true
    })
    orderLines: OrderLineOrmEntity[]


}
