import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (user?.userId) {
      return user.userId;
    }

    if (user?.id) {
      return user.id;
    }

    if (user?.email) {
      return user.email;
    }

    return user;
  },
);