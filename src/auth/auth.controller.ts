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
 * Controller for the authentication routes.
 */
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly logtailService: LogginService
  ) {}

  /**
   * Register a new user.
   * @param req - The HTTP request.
   * @param registerUserDto - The data to register the user.
   * @returns A promise that resolves with the response of the registration.
   */
  @Post('register')
  async registerUser(@Req() req: Request, @Body() registerUserDto: RegisterUserDto) {
    // Recontruct the full URL of the request.
    const url = "http://" + req.headers['host'] + req.url;
    const user = await firstValueFrom(this.client.send({ cmd: 'auth_register_user' }, registerUserDto))
    .catch((error) => {
      this.logtailService.error(`User ${registerUserDto.email} with ${ registerUserDto.role } role isn't registered - ${url}`, 'register user');
      throw new RpcException('Could not register user');
    });
    // Log the registration in betterstack.
    this.logtailService.log(`User ${registerUserDto.email} with ${ registerUserDto.role } role is registered - ${url}`);
    return user;
  }

  /**
   * Login a user.
   * @param req - The HTTP request.
   * @param loginUserDto - The data to login the user.
   * @returns A promise that resolves with the response of the login.
   */
  @Post('login')
  async loginUser(@Req() req:Request, @Body() loginUserDto: LoginUserDto) {
    const url = "http://" + req.headers['host'] + req.url;
    // Get the user from the microservice
    const user = await firstValueFrom(this.client.send({ cmd: 'auth_login_user' }, loginUserDto))
    .catch((error) => {
      this.logtailService.error(`User ${loginUserDto.email} with ${ loginUserDto.role } role, invalid credentials - ${url}`, 'login user');
      throw new RpcException('Invalid credentials');
    });

    this.logtailService.log(`User ${loginUserDto.email} with ${ loginUserDto.role } role is logged - ${url}`);
    return user;
  }

  /**
   * Verify a token.
   * @param req - The HTTP request.
   * @param user - The current user.
   * @param token - The token to verify.
   * @returns A promise that resolves with the response of the verification.
  */
  @UseGuards(AuthGuard)
  @Get('verify')
  async verifyToken(@Req() req:Request ,@User() user: CurrentUser, @Token() token: string){
    // Reconstruc the full URL of the request.
    const url = "http://" + req.headers['host'] + req.url;
    // Log the token validation in betterstack.
    this.logtailService.log(`User ${user.email}, ${ user.role } role - ${url} - Validated Token`);
    return this.client.send({ cmd: 'auth_verify_user' }, {token});
  }

}
