import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { ActionEnum } from "src/enum/action.enum";

export class UpdateOrderLineDto {

    @IsOptional()
    @IsString()
    id: string;

    @IsOptional()
    @IsString()
    product?: string;

    @IsOptional()
    @IsNumber()
    totalQty?: number;
}


export class UpdateOrderDto {

    @IsEnum(ActionEnum)
    action: ActionEnum;

    @IsOptional()
    lines?: UpdateOrderLineDto[];
}