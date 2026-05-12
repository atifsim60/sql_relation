import { IsNumber, IsString } from "class-validator";


export class UpdateOrderLineDto {

    @IsNumber()
    qty: number

    @IsString()
    orderId: string
}