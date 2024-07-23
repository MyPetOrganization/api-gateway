import { IsString, IsEmail, IsIn, MinLength, IsOptional  } from 'class-validator';
import { Transform } from "class-transformer";

/**
 * Data transfer object for create user
 */
export class CreateUserDto {

    /**
     * User name
     * Verify that the user name is a string
     * @example John Doe
     */
    @IsString()
    public name: string;

    /**
     * User email
     * Verify that the user email is an email
     * @example johndo@example.com
     */
    @IsEmail()
    public email: string;

    /**
     * User password
     * Verify that the user password is a string
     * Verify that the user password is at least 8 characters long
     * @example 12345678
     */
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(8,{
        message: 'password must be at least 8 characters'
    })
    public password: string;

    /**
     * User favorite movie
     * Verify that the user favorite movie is a string
     * Verify that the user favorite movie is at least 1 character long
     * @example The Matrix
     */
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    favoriteMovie: string;

    /**
     * User role
     * Verify that the user role is a string
     * Verify that the user role is either admin, buyer, or seller
     * @example admin
     */
    @IsString()
    @IsIn(['admin', 'buyer', 'seller'])
    public role: string;

    /**
     * User profile image
     * Verify that the user profile image is a string
     * @example http://example.com/image.jpg
     */
    @IsString()
    @IsOptional()
    public profileImage?: string;
}
