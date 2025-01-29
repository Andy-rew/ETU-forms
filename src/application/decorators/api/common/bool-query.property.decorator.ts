import { IsOptional } from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import { BoolProperty } from '@ivankrtv/openapidoc/dist';
import { Transform } from 'class-transformer';

export const BoolQueryProperty = (params?: { isOptional?: boolean; description?: string }) => {
  const isOptional = params?.isOptional ?? false;
  const description = params?.description ?? 'Флаг';

  const decorators = [
    BoolProperty({ description: description, isOptional: isOptional }),
    Transform((params) => params.value === 'true'),
  ];

  if (isOptional) {
    decorators.push(IsOptional());
  }

  return applyDecorators(...decorators);
};
