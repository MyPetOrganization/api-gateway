import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';

/**
 * Guard to check if the user is authenticated
 */
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    ) {}

    /**
     * Check if the user is authenticated
     * @param context - The execution context
     * @returns True if the user is authenticated
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Extract the request from the context
        const request = context.switchToHttp().getRequest();
        // Extract the token from the request
        const token = this.extractTokenFromHeader(request);
        // If the token is not found, throw an error
        if (!token) {
            throw new UnauthorizedException('Token not found');
        }
        try {
            // Verify the user with the token
            const {user, token: newToken } = await firstValueFrom(
                this.client.send({ cmd: 'auth_verify_user' }, {token})
            );
            // Set the user and token in the request
            request['user'] = user;
            request['token'] = newToken;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    /**
     * Extract the token from the request header
     * @param request - The request
     * @returns The token
     */
    private extractTokenFromHeader(request: Request): string | undefined {
        // Extract the token from the authorization header
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        // Return the token if the type is Bearer
        return type === 'Bearer' ? token : undefined;
    }
}