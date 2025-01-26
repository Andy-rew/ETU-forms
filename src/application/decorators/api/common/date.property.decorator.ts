import { applyDecorators, BadRequestException } from '@nestjs/common';
import { StringProperty } from '@ivankrtv/openapidoc/dist';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsNullValidation } from '@applications/decorators/validation/is-null-validation.decorator';
import * as dayjs from 'dayjs';
import { Transform } from 'class-transformer';

export const DateProperty = (params?: {
  description?: string;
  isOptional?: boolean;
  isNullable?: boolean;
  pattern?: string;
}) => {
  const isOptional = params?.isOptional ?? false;
  const isNullable = params?.isNullable ?? false;
  const pattern = params?.pattern ?? 'YYYY-MM-DD';
  const example = dayjs().format(pattern);

  const decorators = [
    StringProperty({
      example: example,
      pattern: pattern,
      description: params?.description ?? 'Дата',
      isOptional: isOptional,
      nullable: isNullable,
    }),
    Transform(({ value }) => {
      if (!value) {
        return null;
      }

      const date = dayjs(value, pattern, true);

      if (!date.isValid()) {
        throw new BadRequestException('Некорректная дата');
      }

      return date.toDate();
    }),
  ];

  if (isOptional) {
    decorators.push(IsOptional());
  }

  if (!isOptional) {
    decorators.push(IsNotEmpty());
  }

  if (isNullable) {
    decorators.push(IsNullValidation());
  }

  return applyDecorators(...decorators);
};
