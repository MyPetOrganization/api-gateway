import { IsString, IsEmail, IsIn, MinLength } from 'class-validator';
import { Transform } from "class-transformer";

/**
 * Data transfer object for register user
 */
export class RegisterUserDto {
  /**
   * Name of the user
   * Verify that the name is a string
   * @example John Doe
   */
  @IsString()
  public name: string;

  /**
   * Email of the user
   * Verify that the email is an email
   * @example jonhdoe@example.com
   */
  @IsEmail()
  public email: string;

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
  public password: string;

  /**
   * Favorite movie of the user
   * Verify that the favorite movie is a string
   * @example The Matrix
   */
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  public favoriteMovie: string;

  /**
   * Role of the user
   * Verify that the role is a string and is either 'admin', 'buyer', or 'seller'
   * @example admin
   */
  @IsString()
  @IsIn(['admin', 'buyer', 'seller'])
  public role: string;
}
