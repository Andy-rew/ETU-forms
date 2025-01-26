import { applyDecorators, Type } from '@nestjs/common';
import { ArrayProperty } from '@ivankrtv/openapidoc/dist';
import { ArrayNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { IsNullValidation } from '@applications/decorators/validation/is-null-validation.decorator';
import { Type as TypeDecorator } from 'class-transformer';

export function ArraySchemasProperty<T>(params: {
  item: Type<T>;
  description: string;
  minItems?: number;
  maxItems?: number;
  isOptional?: boolean;
  isNullable?: boolean;
}) {
  const isOptional = params?.isOptional ?? false;
  const isNullable = params?.isNullable ?? false;

  const decorators = [
    ArrayProperty({
      items: params.item,
      description: params.description,
      isOptional: isOptional,
      minItems: params.minItems ?? 1,
      maxItems: params.maxItems ?? undefined,
    }),
    ArrayNotEmpty(),
    ValidateNested(),
    TypeDecorator(() => params.item),
  ];

  if (isOptional) {
    decorators.push(IsOptional());
  }

  if (isNullable) {
    decorators.push(IsNullValidation());
  }

  return applyDecorators(...decorators);
}
