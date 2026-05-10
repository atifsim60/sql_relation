import { IsNumber, IsString } from "class-validator";

export class CreatePromoDto {

    @IsString()
    code: string;

    @IsNumber()
    discount: number
}
