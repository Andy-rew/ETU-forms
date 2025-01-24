import { applyDecorators } from '@nestjs/common';
import { ValidateIf } from 'class-validator';

export const IsNullValidation = () => {
  return applyDecorators(
    ValidateIf((obj, val) => {
      return val !== null;
    }),
  );
};
