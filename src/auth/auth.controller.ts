import { Body, Controller, Get, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { LoginUserDto, RegisterUserDto } from './dto';
import { catchError, firstValueFrom } from 'rxjs';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './interfaces/current-user.interface';
import { Token, User } from './decorators';
import { LogginService } from 'src/logging/logtail.service';

/**
 * Controlador principal para manejar las peticiones relacionadas con la autenticación.
 */
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly logtailService: LogginService
  ) {}

  @Post('register')
  async registerUser(@Req() req: Request, @Body() registerUserDto: RegisterUserDto) {
    const url = "http://" + req.headers['host'] + req.url;
    this.logtailService.log(`User ${registerUserDto.email} with ${ registerUserDto.role } role is registering - ${url}`);
    return this.client.send({ cmd: 'auth_register_user' }, registerUserDto)
  }

  @Post('login')
  async loginUser(@Req() req:Request, @Body() loginUserDto: LoginUserDto) {
    const user = await firstValueFrom(this.client.send({ cmd: 'auth_login_user' }, loginUserDto));
    if(!user) {
      throw new RpcException('User not found');
    };
    const url = "http://" + req.headers['host'] + req.url;
    this.logtailService.log(`User ${loginUserDto.email} with ${ loginUserDto.role } role is logged - ${url}`);
    return user;
  }

  /**
   * Verifica el token del usuario.
   * 
   * @param req - La solicitud HTTP.
   * @param user - El usuario actual.
   * @param token - El token a verificar.
   * @returns Una promesa que resuelve con la respuesta de la verificación del token.
  */
  @UseGuards(AuthGuard)
  @Get('verify')
  async verifyToken(@Req() req:Request ,@User() user: CurrentUser, @Token() token: string){
    // Construye la URL completa de la solicitud.
    const url = "http://" + req.headers['host'] + req.url;
    this.logtailService.log(`User ${user.email}, ${ user.role } role - ${url} - Validated Token`);
    return this.client.send({ cmd: 'auth_verify_user' }, {token});
  }

}
