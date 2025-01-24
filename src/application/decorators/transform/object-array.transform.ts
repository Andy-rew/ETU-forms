import { Transform, TransformFnParams } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';

export function ObjectArrayTransform<C>(initClass: new (value: unknown) => C) {
  return applyDecorators(
    Transform((params: TransformFnParams) => {
      if (Array.isArray(params.value)) {
        return params.value.map((value: C) => new initClass(value));
      }

      return false;
    }),
  );
}
