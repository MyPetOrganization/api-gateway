import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCardDto } from './dto/create-cards.dto';
import { UpdateCardDto } from './dto/update-cards.dto';

@Controller('cards')
export class CardsController {
  constructor(
    @Inject('CARDS_SERVICE') private readonly cardsClient: ClientProxy,
  ) {}

  @Post(':id')
  createCard(
    @Body() createCardDto: CreateCardDto,
    @Param('id', ParseIntPipe) id: number,	
  ) {
    console.log('createCardDto', createCardDto);
    return this.cardsClient.send({ cmd: 'create-card' }, { id, createCardDto });
  }

  @Get(':id')
  findAllCards(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.cardsClient.send({ cmd: 'get_all_cards' }, { id });
  }

  @Post('fo/:id')
  findOneCard(
    @Param('id', ParseIntPipe) id: number,
    @Body('cardNumber', ParseIntPipe) cardNumber: number,
  ) {
    return this.cardsClient.send({ cmd: 'get_one_card' }, { id, cardNumber });
  }

  @Delete(':id')
  removeCard(
    @Param('id', ParseIntPipe) id: number,
    @Body('cardNumber', ParseIntPipe) cardNumber: number,
  ) {
    return this.cardsClient.send({ cmd: 'delete_card' }, { id, cardNumber });
  }

  @Patch(':id')
  updateCard(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return this.cardsClient.send({ cmd: 'update_card' }, { id, updateCardDto });
  }

}
