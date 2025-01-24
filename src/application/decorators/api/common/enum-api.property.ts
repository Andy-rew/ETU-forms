import { IsEnum, IsOptional } from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import { EnumProperty } from '@ivankrtv/openapidoc/dist';
import { IsNullValidation } from '@applications/decorators/validation/is-null-validation.decorator';

export const EnumApiProperty = (params: {
  enum: Record<string, any> | string[];
  description: string;
  isOptional?: boolean;
  nullable?: boolean;
}) => {
  const isOptional = params?.isOptional ?? false;
  const isNullable = params?.nullable ?? false;

  const decorators = [
    EnumProperty({
      enum: params.enum,
      isOptional: isOptional,
      description: params?.description ?? 'Роль',
      nullable: isNullable,
    }),
    IsEnum(params.enum),
  ];

  if (isOptional) {
    decorators.push(IsOptional());
  }

  if (isNullable) {
    decorators.push(IsNullValidation());
  }

  return applyDecorators(...decorators);
};
