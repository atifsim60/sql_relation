import { Type } from "class-transformer";
import { IsDefined, IsString, ValidateNested } from "class-validator";


export class CreateOrderLineDto {
    @IsString()
    product: string;

}

export class CreateOrderDto {

    @IsString()
    user: string;


    @IsDefined()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderLineDto)
    lines: CreateOrderLineDto[]


}
