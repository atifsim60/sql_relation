import { UserOrmEntity } from "src/user/entities/user.entity";
import { Column, Entity, Index, ManyToMany, PrimaryColumn } from "typeorm";

@Entity("promos")
export class PromoOrmEntity {
    @PrimaryColumn("uuid")
    id: string;


    @Index()
    @Column()
    code: string;


    @Column({type:"int"})
    discount: number


    @ManyToMany(() => UserOrmEntity, (user) => user.promos,{
        eager:true
    })
    users: UserOrmEntity[];
}
