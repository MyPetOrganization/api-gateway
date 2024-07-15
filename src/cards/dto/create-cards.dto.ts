import { Transform } from "class-transformer";
import { IsDate, IsNumber, IsString, Matches, Max, MaxLength, Min, min, MinLength, minLength } from "class-validator";

export class CreateCardDto {

    @IsNumber()
    cardNumber: number;

    @Transform(({ value }) => value.trim())
    @Matches(/^[a-zA-Z0-9]+$/)
    @IsString()
    cardName: string;

    @Transform(({ value }) => {
        const [month, year] = value.split('/');
        return new Date(`${year}-${month}-01`);
    })
    @IsDate()
    expirationDate: Date;

    @IsString()
    @MinLength(3)
    @MaxLength(4)
    cvv: string;

    @IsNumber()
    userId: number;
}
