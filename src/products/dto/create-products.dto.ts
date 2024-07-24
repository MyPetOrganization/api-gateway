import { IsString, IsNumber, IsPositive  } from 'class-validator';
import { Type } from "class-transformer";

/**
 * Data transfer object with expected fields for creating a new product
 */
export class CreateProductDto {

    /**
     * The product's name
     * Verify that the name is a string
     * @example Dog Food
     */
    @IsString()
    name: string;

    /**
     * The product's price
     * Verify that the price is a number
     * @example 10.99
     * Verify that the price is a positive number
     * Verify that the price has a maximum of 4 decimal places
     * @example 24.9999
     * Convert the price to a number
     */
    @IsNumber({
        maxDecimalPlaces: 4
    })
    @IsPositive()
    @Type(() => Number)
    price: number;

    /**
     * URL of the products's image.
     * Verify that the product image is a string
     * @example https://example.com/product.jpg
     */
    @IsString()
    imageUrl?: string;

    /**
     * The user ID of the user who created the product
     * Verify that the user ID is a number
     * @example 1
     * Convert the user ID to a number
     */
    @IsNumber()
    @Type(() => Number)
    userId: number;
}
