import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";

import { UserDetailsOrmEntity } from "./user-details.entity";
import { OrderOrmEntity } from "src/order/entities/order.entity";
import { PromoOrmEntity } from "src/promo/entities/promo.entity";

@Entity("user")
export class UserOrmEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  email!: string;

  @Column()
  name!: string;

  @OneToOne(() => UserDetailsOrmEntity, (details) => details.user, {
    cascade: ["insert", "update"],
    eager: true,
    nullable: true
  })
  userDetails!: UserDetailsOrmEntity | null;

  @OneToMany(() => OrderOrmEntity, (order) => order.user)
  orders!: OrderOrmEntity[];

  @ManyToMany(() => PromoOrmEntity, (promo) => promo.users, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinTable({
    name:"join_table_promo_user"
  })
  promos!: PromoOrmEntity[];
}