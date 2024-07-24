import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsPositive  } from 'class-validator';
import { CreateProductDto } from './create-products.dto';
import { Type } from 'class-transformer';

/**
 * The Data Transfer Object (DTO) for updating a product.
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {

    /**
     * The product's id
     * Verify that the product id arrives
     * Verify that the id is a number and positive
     * @example 1
     */
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    id: number;
}
