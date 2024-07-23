import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

/**
 * Decorator to get the token from the request
 */
export const Token = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        // Get the request from the context
        const request = context.switchToHttp().getRequest();
        // Check if the token is present in the request
        if (!request.token) {
            throw new InternalServerErrorException('Token not found in request (AuthGuard called?)');
        }
        return request.token;
    },
);