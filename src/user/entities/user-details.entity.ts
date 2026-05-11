import {
    Entity,
    PrimaryColumn,
    Column,
    OneToOne,
    JoinColumn,
} from "typeorm";

import { UserOrmEntity } from "./user.entity";

@Entity("user-details")
export class UserDetailsOrmEntity {
    @PrimaryColumn()
    id!: string;

    @Column()
    gender!: string;

    @Column()
    photo!: string;

    @OneToOne(() => UserOrmEntity, (user) => user.userDetails, {
        onDelete: "CASCADE",
    })
    @JoinColumn()
    user!: UserOrmEntity;
}