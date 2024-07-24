import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateCardDto } from './dto/create-cards.dto';
import { UpdateCardDto } from './dto/update-cards.dto';
import { NATS_SERVICE } from 'src/config';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { catchError, firstValueFrom, lastValueFrom, toArray } from 'rxjs';
import { LogginService } from 'src/logging/logtail.service';

/**
 * Controller for the cards routes.
 */
@Controller('cards')
export class CardsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly logtailService: LogginService
  ) { }

  /**
   * Create a new card.
   * @param req - The HTTP request.
   * @param createCardDto - The data to create the card.
   * @param id - The id of the user.
   * @returns A promise that resolves with the response of the creation.
   */
  @UseGuards(AuthGuard)
  @Post(':id')
  async createCard(
    @Req() req: Request,
    @Body() createCardDto: CreateCardDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    // Get the user from the microservice
    const user = await firstValueFrom(this.client.send({ cmd: 'get_one_user' }, { id }));
    // Reconstruct the full URL of the request
    const url = "http://" + req.headers['host'] + req.url;

    // Create the card
    const card = await firstValueFrom(this.client.send({ cmd: 'create_card' }, { id, createCardDto }))
      // .catch(() => {
      //   this.logtailService.error(`${user.name} cannot create a card - ${url}`);
      //   throw new RpcException('Cannot create a card');
      // });

    // Log the creation in betterstack
    this.logtailService.log(`Creating a new card for user ${user.name} - ${url}`);
    return card;
  }

  /**
   * Get all cards.
   * @param req - The HTTP request.
   * @param id - The id of the user.
   * @returns A promise that resolves with the response of the retrieval.
   */
  @UseGuards(AuthGuard)
  @Get(':id')
  async findAllCards(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = await firstValueFrom(this.client.send({ cmd: 'get_one_user' }, { id }));
    const url = "http://" + req.headers['host'] + req.url;
    this.logtailService.log(`Getting all cards for user ${user.name}, ${user.email} - ${url}`);
    return this.client.send({ cmd: 'get_all_cards' }, { id })
      // .pipe(catchError(() => {
      //   this.logtailService.error(`User ${user.name}, ${user.email} cannot get the cards - ${url}`);
      //   throw new RpcException('Error getting cards');
      // }));
  }

  /**
   * Get one card.
   * @param req - The HTTP request.
   * @param id - The id of the user.
   * @param cardNumber - The card number.
   * @returns A promise that resolves with the response of the retrieval.
   */
  @UseGuards(AuthGuard)
  @Post('fo/:id')
  async findOneCard(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body('cardNumber') cardNumber: string,
  ) {
    const user = await firstValueFrom(this.client.send({ cmd: 'get_one_user' }, { id }));
    const url = "http://" + req.headers['host'] + req.url;
    const card = await firstValueFrom(this.client.send({ cmd: 'get_one_card' }, { id, cardNumber }))
      .catch(() => {
        this.logtailService.error(`Card ${cardNumber} for user ${user.name}, ${user.email} not found - ${url}`);
        throw new RpcException('Card not found');
      });
    this.logtailService.log(`Getting ${cardNumber} card for user ${user.name}, ${user.email} - ${url}`);
    return card;
  }

  /**
   * Delete a card.
   * @param req - The HTTP request.
   * @param id - The id of the user.
   * @param cardNumber - The card number.
   * @returns A promise that resolves with the response of the deletion.
   */
  @Delete(':id')
  async removeCard(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body('cardNumber') cardNumber: string,
  ) {
    const user = await firstValueFrom(this.client.send({ cmd: 'get_one_user' }, { id }));
    const url = "http://" + req.headers['host'] + req.url;
    this.logtailService.log(`Deleting ${cardNumber} card for user ${user.name}, ${user.email} - ${url}`);
    return this.client.send({ cmd: 'delete_card' }, { id, cardNumber })
      .pipe(catchError(() => {
        this.logtailService.error(`User ${user.name}, ${user.email} cannot delete the card ${cardNumber} - ${url}`);
        throw new RpcException('Error deleting card');
      }));
  }

  /**
   * Update a card.
   * @param req - The HTTP request.
   * @param id - The id of the user.
   * @param updateCardDto - The data to update the card.
   * @returns A promise that resolves with the response of the update.
   */
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateCard(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    const user = await firstValueFrom(this.client.send({ cmd: 'get_one_user' }, { id }));
    const url = "http://" + req.headers['host'] + req.url;
    const card = await firstValueFrom(this.client.send({ cmd: 'update_card' }, { id, updateCardDto }))
      .catch(() => {
        this.logtailService.error(`User ${user.name}, ${user.email} cannot delete the card ${updateCardDto.cardNumber} - ${url}`);
        throw new RpcException('Card not found');
      });
    this.logtailService.log(`Updating ${updateCardDto.cardNumber} card for user ${user.name}, ${user.email} - ${url}`);
    return card;
  }

}
