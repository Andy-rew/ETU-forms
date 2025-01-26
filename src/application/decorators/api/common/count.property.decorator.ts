import { applyDecorators } from '@nestjs/common';
import { IntProperty } from '@ivankrtv/openapidoc/dist';
import { IsNullValidation } from '@applications/decorators/validation/is-null-validation.decorator';
import { IsInt, Min } from 'class-validator';
import { TransformToInt } from '@applications/decorators/transform/numeric.transform';

export const CountProperty = (params?: { nullable?: boolean; description?: string }) => {
  const nullable = params?.nullable ?? false;
  const description = params?.description ?? 'Сколько всего элементов в системе';
  const decorators = [IntProperty({ description: description, example: 1 }), IsInt(), Min(0), TransformToInt()];

  if (nullable) {
    decorators.push(IsNullValidation());
  }

  return applyDecorators(...decorators);
};
