import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCardDto } from './dto/create-cards.dto';
import { UpdateCardDto } from './dto/update-cards.dto';
import { NATS_SERVICE } from 'src/config';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { firstValueFrom } from 'rxjs';
import { LogginService } from 'src/logging/logtail.service';

@Controller('cards')
export class CardsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly logtailService: LogginService
  ) {}

  @Post(':id')
  async createCard(
    @Req() req: Request,
    @Body() createCardDto: CreateCardDto,
    @Param('id', ParseIntPipe) id: number,	
  ) {
    const user = await firstValueFrom( this.client.send({ cmd: 'get_one_user' }, { id }) );
    const url = "http://" + req.headers['host'] + req.url;
    this.logtailService.log(`Creating a new card for user ${user.name} - ${url}`);
    return this.client.send({ cmd: 'create-card' }, { id, createCardDto });
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findAllCards(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = await firstValueFrom( this.client.send({ cmd: 'get_one_user' }, { id }) );
    const url = "http://" + req.headers['host'] + req.url;
    this.logtailService.log(`Getting all cards for user ${user.name}, ${user.email} - ${url}`);
    return this.client.send({ cmd: 'get_all_cards' }, { id });
  }

  @UseGuards(AuthGuard)
  @Post('fo/:id')
  async findOneCard(
    @Req() req: Request, 
    @Param('id', ParseIntPipe) id: number,
    @Body('cardNumber', ParseIntPipe) cardNumber: number,
  ) {
    const user = await firstValueFrom( this.client.send({ cmd: 'get_one_user' }, { id }) );
    const url = "http://" + req.headers['host'] + req.url;
    this.logtailService.log(`Getting ${cardNumber} card for user ${user.name}, ${user.email} - ${url}`);
    return this.client.send({ cmd: 'get_one_card' }, { id, cardNumber });
  }

  @Delete(':id')
  async removeCard(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body('cardNumber', ParseIntPipe) cardNumber: number,
  ) {
    const user = await firstValueFrom( this.client.send({ cmd: 'get_one_user' }, { id }) );
    const url = "http://" + req.headers['host'] + req.url;
    this.logtailService.log(`Deleting ${cardNumber} card for user ${user.name}, ${user.email} - ${url}`);
    return this.client.send({ cmd: 'delete_card' }, { id, cardNumber });
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateCard(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    const user = await firstValueFrom( this.client.send({ cmd: 'get_one_user' }, { id }) );
    const url = "http://" + req.headers['host'] + req.url;
    this.logtailService.log(`Updating ${updateCardDto.cardNumber} card for user ${user.name}, ${user.email} - ${url}`);
    return this.client.send({ cmd: 'update_card' }, { id, updateCardDto });
  }

}
