import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, map } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';
import { NATS_SERVICE } from 'src/config';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { LogginService } from 'src/logging/logtail.service';

/**
 * Controller for the users routes.
 */
@Controller('users')
export class UsersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly logtailService: LogginService
  ) { }

  /**
   * Create a new user.
   * @param req - The HTTP request.
   * @param createUserDto - The data to create the user.
   * @param image - The image of the user.
   * @returns A promise that resolves with the response of the creation.
   */
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createUser(
    @Req() req: Request,
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const url = "http://" + req.headers['host'] + req.url;
    const user = await firstValueFrom(this.client.send({ cmd: 'create_user' }, { createUserDto, image }))
      .catch(() => {
        this.logtailService.error(`User ${createUserDto.email} with ${createUserDto.role} role isn't registered - ${url}`);
        throw new RpcException('Error creating user');
      });
    this.logtailService.log(`Creating a new user ${createUserDto.name}, ${createUserDto.email} and ${createUserDto.role}  - ${url}`);
    return user;
  }

  /**
   * Get one user.
   * @param id - The id of the user.
   * @returns A promise that resolves with the response of the retrieval.
   */
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOneUser(@Param('id') id: string) {
    const user = await firstValueFrom(
      this.client.send({ cmd: 'get_one_user' }, { id })
    )
    if (!user) {
      throw new RpcException('User not found');
    }
    return user;
  }

  /**
   * Find one user by email.
   * @param email - The email of the user.
   * @returns A promise that resolves with the response of the retrieval.
   */
  @Post('/search')
  async findOneUserByEmail(@Body() email: string,) {
    const user = await firstValueFrom(
      this.client.send({ cmd: 'get_user_by_email' }, { email })
    )
    return user;
  }

  /**
   * Update a user.
   * @param req - The HTTP request.
   * @param id - The id of the user.
   * @param updateUserDto - The data to update the user.
   * @param image - The image of the user.
   * @returns A promise that resolves with the response of the update.
   */
  @UseGuards(AuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  updateUser(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const url = "http://" + req.headers['host'] + req.url;
    const user = firstValueFrom(this.client.send({ cmd: 'update_user' }, { id, updateUserDto, image }))
    .catch(() => {
      this.logtailService.error(`Cannot update user with name ${updateUserDto.name} and ${updateUserDto.role} role - ${url}`);
      throw new RpcException('User not found');
    });
    this.logtailService.log(`Updated user with name ${updateUserDto.name} and ${updateUserDto.role} role - ${url}`);
    return user;
  }

  /**
   * Delete a user.
   * @param req - The HTTP request.
   * @param id - The id of the user.
   * @returns A promise that resolves with the response of the deletion.
   */
  @Delete(':id')
  async deleteUser(@Req() req: Request, @Param('id') id: string) {
    const user = await firstValueFrom(this.client.send({ cmd: 'get_one_user' }, { id }));
    const url = "http://" + req.headers['host'] + req.url;
    this.logtailService.log(`Deleted ${user.name} user with ${user.email} email and ${user.role} role - ${url}`);
    return this.client.send({ cmd: 'delete_user' }, { id })
      .pipe(catchError(() => {
        this.logtailService.error(`Cannot delete user with name ${user.name} and ${user.email} email - ${url}`);
        throw new RpcException('Error deleting user');
      }));
  }
}
