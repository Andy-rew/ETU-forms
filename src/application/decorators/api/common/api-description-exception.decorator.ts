import { applyDecorators } from '@nestjs/common';
import { StringProperty } from '@ivankrtv/openapidoc/dist';

export const ApiMessageException = (description: string, example?: string) => {
  return applyDecorators(StringProperty({ example: example ?? description, description: description }));
};
