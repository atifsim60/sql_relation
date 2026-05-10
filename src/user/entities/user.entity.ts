import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { UserDetailsOrmEntity } from "./user-details.entity";
import { OrderOrmEntity } from "src/order/entities/order.entity";



@Entity('user')
export class UserOrmEntity {

    @PrimaryColumn()
    id!: string;


    @Column({})
    email!: string;


    @Column()
    name!: string;

     @OneToOne(() => UserDetailsOrmEntity,{
        cascade:true,
        lazy:true
     })
    @JoinColumn({name:"user_details",
    })
    userDetails!: UserDetailsOrmEntity


    
    @OneToMany(() => OrderOrmEntity, (order) => order.user)
    orders: OrderOrmEntity[]
}
