import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';
import { NATS_SERVICE } from 'src/config';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    createUser(
      @Body() createUserDto: CreateUserDto,
      @UploadedFile() image?: Express.Multer.File,
    ) {
      return this.client.send({ cmd: 'create_user' }, {createUserDto, image});
    }

    @Get()
    findAllUsers() {
      return this.client.send({ cmd: 'get_all_users' }, {});
    }
    
    @Get(':id')
    async findOneUser(@Param('id') id: string) {
      const user = await firstValueFrom(
        this.client.send({ cmd: 'get_one_user' }, { id })
      )
      return user;
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'))
    updateUser(
      @Param('id') id: number,
      @Body() updateUserDto: UpdateUserDto,
      @UploadedFile() image?: Express.Multer.File,
    ) {
      return this.client.send({ cmd: 'update_user' }, { id, updateUserDto, image });
    }

    @Delete(':id')
    deleteUser(@Param('id') id: string) {
      return this.client.send({ cmd: 'delete_user' }, { id });
    }
}
