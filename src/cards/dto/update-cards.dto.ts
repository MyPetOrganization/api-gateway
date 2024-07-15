import { PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-cards.dto';
import { IsNumber } from 'class-validator';

export class UpdateCardDto extends PartialType(CreateCardDto) {
    @IsNumber()
    cardNumber: number;
}
