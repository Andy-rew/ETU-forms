import { StringProperty } from '@ivankrtv/openapidoc/dist';
import { IsEmail, IsOptional } from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import { IsNullValidation } from '@applications/decorators/validation/is-null-validation.decorator';

export const EmailProperty = (params?: { isOptional?: boolean; nullable?: boolean }) => {
  const isOptional = params && params?.isOptional ? params.isOptional : false;
  const isNullable = params && params?.nullable ? params.nullable : false;

  const decorators = [
    StringProperty({
      example: 'email@example.com',
      description: 'Адрес электронной почты',
      isOptional: isOptional,
      nullable: isNullable,
    }),
    IsEmail(),
  ];

  if (isOptional) {
    decorators.push(IsOptional());
  }

  if (isNullable) {
    decorators.push(IsNullValidation());
  }

  return applyDecorators(...decorators);
};
