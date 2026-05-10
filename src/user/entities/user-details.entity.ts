import { Column, Entity, PrimaryColumn } from "typeorm";



@Entity("user-details")
export class UserDetailsOrmEntity{
    @PrimaryColumn()
    id!: string;

    @Column()
    gender!: string

    @Column()
    photo!: string
}