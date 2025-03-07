import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { StringProperty } from '@ivankrtv/openapidoc/dist';
import { applyDecorators } from '@nestjs/common';
import { IsNullValidation } from '@applications/decorators/validation/is-null-validation.decorator';

type TextPropertyParams = {
  description?: string;
  example?: string;
  isOptional?: boolean;
  maxLength?: number;
  minLength?: number;
  nullable?: boolean;
};

const defaultParams: Required<TextPropertyParams> = {
  description: 'Текстовое поле',
  example: 'Текстовое значение',
  isOptional: false,
  maxLength: 1000,
  minLength: 0,
  nullable: false,
};

export function TextProperty(params: TextPropertyParams = defaultParams) {
  const nullable = params?.nullable ?? defaultParams.nullable;
  const isOptional = params?.isOptional ?? defaultParams.isOptional;
  const description = params?.description ?? defaultParams.description;
  const example = params?.example ?? defaultParams.example;
  const maxLength = params?.maxLength ?? defaultParams.maxLength;
  const minLength = params?.minLength ?? defaultParams.minLength;

  const decorators = [
    StringProperty({
      nullable: nullable,
      isOptional: isOptional,
      description: description,
      example: example,
      minLength: minLength,
      maxLength: maxLength,
    }),
    IsString(),
    MinLength(minLength),
    MaxLength(maxLength),
  ];

  if (isOptional) {
    decorators.push(IsOptional());
  }

  if (nullable) {
    decorators.push(IsNullValidation());
  }

  return applyDecorators(...decorators);
}
