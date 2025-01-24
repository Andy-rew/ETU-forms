import { applyDecorators } from '@nestjs/common';
import { StringProperty } from '@ivankrtv/openapidoc/dist';
import { IsJWT, IsOptional } from 'class-validator';
import { IsNullValidation } from '@applications/decorators/validation/is-null-validation.decorator';

export const JwtTokenProperty = (params?: { description?: string; isOptional?: boolean; isNullable?: boolean }) => {
  const isOptional = params && params?.isOptional ? params.isOptional : false;
  const isNullable = params && params?.isNullable ? params.isNullable : false;

  const decorators = [
    applyDecorators(
      StringProperty({
        description: params?.description ?? 'jwt token для авторизации',
        example:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlzQmFuIjpmYWxzZSwiaXNBY3RpdmUiOnRydWUsImlhdCI6MTcxNTc2MjQ5OCwiZXhwIjoxNzE2MDIxNjk4fQ.K73LOmx9CyGIWKSU9uqi4trBFcHPvUvJyXRldM1V6m8',
      }),
      IsJWT,
    ),
  ];

  if (isOptional) {
    decorators.push(IsOptional());
  }

  if (isNullable) {
    decorators.push(IsNullValidation());
  }

  return applyDecorators(...decorators);
};
