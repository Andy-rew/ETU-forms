import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const ReqToken = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (!request.token) {
    throw new UnauthorizedException('Token not found in request');
  }
  return request.token;
});
