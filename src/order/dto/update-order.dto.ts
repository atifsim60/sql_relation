import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsEnum } from 'class-validator';
import { ActionEnum } from 'src/enum/action.enum';



export class UpdateOrderDto extends PartialType(CreateOrderDto) {


    @IsEnum(ActionEnum)
    action: ActionEnum


}
