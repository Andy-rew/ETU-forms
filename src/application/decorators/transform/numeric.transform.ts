import { Transform } from 'class-transformer';

export function TransformToInt() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value, 10);
    }
    return value;
  });
}
