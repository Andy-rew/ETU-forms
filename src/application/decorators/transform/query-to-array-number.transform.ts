import { Transform } from 'class-transformer';

export function QueryToArrayNumberTransform() {
  return Transform(({ value }: { value: string | string[] }) => {
    if (Array.isArray(value)) {
      return value;
    }

    return value.split(',').map(Number);
  });
}
