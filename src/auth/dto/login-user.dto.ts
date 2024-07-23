import { Transform } from "class-transformer";
import { IsEmail, IsIn, IsString, MinLength } from "class-validator";

/**
 * Data transfer object for login user
 */
export class LoginUserDto {

    /**
     * Email of the user
     * Verify that the email is an email
     * @example johndoe@example.com
     */
    @IsString()
    @IsEmail()
    email: string;

    /**
     * Password of the user
     * Verify that the password is a string
     * Verify that the password is at least 8 characters long
     * @example password123
     */
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(8, {
        message: 'password must be at least 8 characters'
    })
    password: string;

    /**
     * Role of the user
     * Verify that the role is a string
     * @example admin
     */
    @IsString()
    @IsIn(['admin', 'buyer', 'seller'])
    role: string;

}