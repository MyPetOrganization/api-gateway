import { IsString, IsEmail, IsIn, MinLength, IsOptional  } from 'class-validator';
import { Transform } from "class-transformer";

export class CreateUserDto {

    @IsString()
    public name: string;

    @IsEmail()
    public email: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(8,{
        message: 'password must be at least 8 characters'
    })
    public password: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    favoriteMovie: string;

    @IsString()
    @IsIn(['admin', 'buyer', 'seller'])
    public role: string;

    @IsString()
    @IsOptional()
    public profileImage?: string;
}
