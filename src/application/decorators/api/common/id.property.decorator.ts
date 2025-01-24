import { applyDecorators } from '@nestjs/common';
import { IntProperty } from '@ivankrtv/openapidoc/dist';
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { IsNullValidation } from '@applications/decorators/validation/is-null-validation.decorator';
import { TransformToInt } from '@applications/decorators/transform/numeric.transform';

export const IdProperty = (params?: { isOptional?: boolean; nullable?: boolean; description?: string }) => {
  const isOptional = params && params?.isOptional ? params.isOptional : false;
  const isNullable = params && params?.nullable ? params.nullable : false;
  const description = params && params?.description ? params.description : 'Id сущности';

  const decorators = [
    IntProperty({
      example: 1,
      description: description,
      isOptional: isOptional,
      nullable: isNullable,
    }),
    IsInt(),
    IsPositive(),
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
