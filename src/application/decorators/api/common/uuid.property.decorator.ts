import { applyDecorators } from '@nestjs/common';
import { StringProperty } from '@ivankrtv/openapidoc/dist';
import { IsUUID } from 'class-validator';

export const UuidProperty = (description?: string) => {
  return applyDecorators(
    StringProperty({
      description: description ?? 'UUID',
      example: '5b679568-5737-4216-9ef4-df4ea7499d1e',
    }),
    IsUUID(),
  );
};
