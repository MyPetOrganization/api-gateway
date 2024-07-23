import { PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-cards.dto';
import { IsNumber } from 'class-validator';

/**
 * Data transfer object for update card
 */
export class UpdateCardDto extends PartialType(CreateCardDto) {
    /**
     * Card number
     * Verify that the card number is a number
     * @example 1234567890123456
     */
    @IsNumber()
    cardNumber: number;
}
