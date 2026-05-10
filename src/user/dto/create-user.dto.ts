import { Type } from "class-transformer";
import { IsDefined, IsEmail, IsEnum, IsNotEmptyObject, IsString, ValidateNested } from "class-validator"
import { Gender } from "src/enum/gender.enum";



export class CreateUserDetails{

    @IsEnum(Gender)
    gender:string;

    @IsString()
    photo: string
}

export class CreateUserDto {
    @IsEmail()
    email:string;

    @IsString()
    name: string;

    @IsNotEmptyObject()
    @IsDefined()
    @ValidateNested()
    @Type(() => CreateUserDetails)
    details: CreateUserDetails

}




