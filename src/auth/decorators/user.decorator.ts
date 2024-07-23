import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

/**
 * Decorator to get the user from the request
 */
export const User = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        // Get the request from the context
        const request = context.switchToHttp().getRequest();
        // Check if the user is present in the request
        if (!request.user) {
            throw new InternalServerErrorException('User not found in request (AuthGuard called?)');
        }
        return request.user;
    },
);