import { Transform, TransformFnParams } from 'class-transformer';

export function ObjectTransform<C>(initClass: new () => C) {
  return Transform(({ value }: TransformFnParams) => {
    if (typeof value === 'object') {
      return Object.assign(new initClass(), value);
    }
    return value;
  });
}
