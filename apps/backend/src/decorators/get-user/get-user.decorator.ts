// decorador para filtar los datos del usuario guardados en el request
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        if (request.data.userId) {
            return request.data.userId;
        }
        if (request.data.email) {
            return request.data.email;
        }
        return request.data;
    }
);
