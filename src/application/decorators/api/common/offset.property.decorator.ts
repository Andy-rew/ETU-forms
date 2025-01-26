import { IsInt, IsOptional, Min } from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import { IntProperty } from '@ivankrtv/openapidoc/dist';
import { IsNullValidation } from '@applications/decorators/validation/is-null-validation.decorator';
import { TransformToInt } from '@applications/decorators/transform/numeric.transform';

export const OffsetProperty = (params?: { isOptional?: boolean; isNullable?: boolean }) => {
  const isOptional = params && params?.isOptional ? params.isOptional : false;
  const isNullable = params && params?.isNullable ? params.isNullable : false;

  const decorators = [
    IntProperty({
      example: 0,
      description: 'Смещение от начала списка',
      minimum: 0,
      isOptional: isOptional,
    }),
    IsInt(),
    Min(0),
    TransformToInt(),
  ];

  if (isOptional) {
    decorators.push(IsOptional());
  }

  if (isNullable) {
    decorators.push(IsNullValidation());
  }

  return applyDecorators(...decorators);
};
