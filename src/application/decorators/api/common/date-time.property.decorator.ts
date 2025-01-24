import { applyDecorators } from '@nestjs/common';
import { StringProperty } from '@ivankrtv/openapidoc/dist';
import { IsISO8601, IsOptional } from 'class-validator';
import { IsNullValidation } from '@applications/decorators/validation/is-null-validation.decorator';

export const DateWithTimeProperty = (params?: { description?: string; isOptional?: boolean; nullable?: boolean }) => {
  const isOptional = params?.isOptional ?? false;
  const isNullable = params && params?.nullable ? params.nullable : false;

  const decorators = [
    StringProperty({
      example: '2024-04-26T12:00:00Z',
      pattern: 'YYYY-MM-DDTHH:mm:ssZ',
      description: params?.description ?? 'Дата и время',
      isOptional: isOptional,
    }),
    IsISO8601(
      {
        strict: false,
      },
      {
        message: (validationArguments) => {
          return `${validationArguments.property} должно быть действительной датой и временем в формате YYYY-MM-DDTHH:mm:ssZ`;
        },
      },
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
