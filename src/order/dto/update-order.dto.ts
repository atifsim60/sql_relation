import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { ActionEnum } from "src/enum/action.enum";

export class UpdateOrderLineDto {

    @IsOptional()
    @IsUUID("7")
    id?: string;

    @IsOptional()
    @IsUUID("7")
    product?: string;

    @IsOptional()
    @IsNumber()
    qty?: number;

    @IsOptional()
    @IsNumber()
    price?: number
}


export class UpdateOrderDto {



    @IsOptional()
    lines!: UpdateOrderLineDto[];
}