import { applyDecorators } from '@nestjs/common';
import { EnumProperty } from '@ivankrtv/openapidoc/dist';

export const ApiTypeException = (type: string) => {
  return applyDecorators(EnumProperty({ enum: [type] }));
};
