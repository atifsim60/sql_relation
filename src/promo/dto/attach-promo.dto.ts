import { ArrayNotEmpty, IsArray, IsString } from "class-validator";




export class AttachPromoDto{


@IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  userIds: string[];


}