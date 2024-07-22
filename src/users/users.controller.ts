import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';
import { NATS_SERVICE } from 'src/config';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { LogginService } from 'src/logging/logtail.service';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly logtailService: LogginService
  ) {}

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    createUser(
      @Req() req: Request,
      @Body() createUserDto: CreateUserDto,
      @UploadedFile() image?: Express.Multer.File,
    ) {
      const url = "http://" + req.headers['host'] + req.url;
      this.logtailService.log(`Creating a new user ${createUserDto.name}, ${createUserDto.email} and ${createUserDto.role}  - ${url}`);
      return this.client.send({ cmd: 'create_user' }, {createUserDto, image});
    }

    @UseGuards(AuthGuard)
    @Get()
    findAllUsers() {
      return this.client.send({ cmd: 'get_all_users' }, {});
    }
    
    @UseGuards(AuthGuard)
    @Get(':id')
    async findOneUser(@Param('id') id: string) {
      const user = await firstValueFrom(
        this.client.send({ cmd: 'get_one_user' }, { id })
      )
      return user;
    }

    @Post('/search')
    async findOneUserByEmail(@Body() email: string,) {
      const user = await firstValueFrom(
        this.client.send({ cmd: 'get_user_by_email' }, { email })
      )
      return user;
    }

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
      this.logtailService.log(`Updated user with name ${updateUserDto.name} and ${updateUserDto.role} role - ${url}`);
      return this.client.send({ cmd: 'update_user' }, { id, updateUserDto, image });
    }

    @Delete(':id')
    async deleteUser(@Req() req: Request, @Param('id') id: string) {
      const user = await firstValueFrom( this.client.send({ cmd: 'get_one_user' }, { id }) );
      const url = "http://" + req.headers['host'] + req.url;
      this.logtailService.log(`Deleted ${user.name} user with ${user.email} email and ${user.role} role - ${url}`);
      return this.client.send({ cmd: 'delete_user' }, { id });
    }
}
