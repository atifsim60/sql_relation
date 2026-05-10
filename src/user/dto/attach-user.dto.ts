import { ArrayNotEmpty, IsArray, IsString } from "class-validator";



export class AttachUserDto {
    @IsArray()
      @ArrayNotEmpty()
      @IsString({ each: true })
      promos: string[];
}