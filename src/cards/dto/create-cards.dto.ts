import { Transform } from "class-transformer";
import { IsDate, IsNumber, IsString, Matches, MaxLength, MinLength} from "class-validator";

/**
 * Data transfer object for create card
 */
export class CreateCardDto {

    /**
     * Card number
     * Verify that the card number is a number
     * @example 1234567890123456
     */
    @IsNumber()
    cardNumber: number;

    /** 
     * Card name
     * Verify that the card name is a string
     * Verify that the card name is only string and number
     * @example Card of John Doe
     */
    @Transform(({ value }) => value.trim())
    @Matches(/^[a-zA-Z0-9]+$/)
    @IsString()
    cardName: string;

    /**
     * Expiration date
     * Verify that the expiration date is a date
     * @example 01/2022
     */
    @Transform(({ value }) => {
        const [month, year] = value.split('/');
        return new Date(`${year}-${month}-01`);
    })
    @IsDate()
    expirationDate: Date;

    /**
     * CVV
     * Verify that the CVV is a string
     * Verify that the CVV is at least 3 characters long
     * Verify that the CVV is at most 4 characters long
     * @example 123
     */
    @IsString()
    @MinLength(3)
    @MaxLength(4)
    cvv: string;

    /**
     * User id
     * Verify that the user id is a number
     * @example 1
     */
    @IsNumber()
    userId: number;
}
