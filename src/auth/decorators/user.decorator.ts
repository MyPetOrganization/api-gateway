import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const User = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        if (!request.user) {
            throw new InternalServerErrorException('User not found in request (AuthGuard called?)');
        }
        return request.user;
    },
);