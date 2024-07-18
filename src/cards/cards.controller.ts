import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCardDto } from './dto/create-cards.dto';
import { UpdateCardDto } from './dto/update-cards.dto';
import { NATS_SERVICE } from 'src/config';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('cards')
export class CardsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post(':id')
  createCard(
    @Body() createCardDto: CreateCardDto,
    @Param('id', ParseIntPipe) id: number,	
  ) {
    console.log('createCardDto', createCardDto);
    return this.client.send({ cmd: 'create-card' }, { id, createCardDto });
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findAllCards(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.client.send({ cmd: 'get_all_cards' }, { id });
  }

  @UseGuards(AuthGuard)
  @Post('fo/:id')
  findOneCard(
    @Param('id', ParseIntPipe) id: number,
    @Body('cardNumber', ParseIntPipe) cardNumber: number,
  ) {
    return this.client.send({ cmd: 'get_one_card' }, { id, cardNumber });
  }

  @Delete(':id')
  removeCard(
    @Param('id', ParseIntPipe) id: number,
    @Body('cardNumber', ParseIntPipe) cardNumber: number,
  ) {
    return this.client.send({ cmd: 'delete_card' }, { id, cardNumber });
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  updateCard(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return this.client.send({ cmd: 'update_card' }, { id, updateCardDto });
  }

}
