import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ArrayProperty } from '@ivankrtv/openapidoc/dist';
import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';

type ArrayPrimitivePropertyDecoratorParams = {
  minItems?: number;
  maxItems?: number;
  isOptional?: boolean;
  nullable?: boolean;
  description?: string;
  enum?: Record<string, any> | string[];
  items: 'string' | 'number' | 'uuid' | 'email' | 'enum';
};

/**
 * @description Декоратор для массива строк или чисел.
 *
 * @param {ArrayPrimitivePropertyDecoratorParams} params - Параметры декорируемого свойства
 *
 * @param {number} [params.minItems=1]- Минимальное количество элементов, разрешенное в массиве.
 * @param {number} [params.maxItems=50] - Максимальное количество элементов, разрешенное в массиве.
 * @param {boolean} [params.isOptional=false] - Указывает, является ли свойство массива опциональным.
 * @param {boolean} [params.nullable=false] - Указывает, может ли свойство массива быть равно null.
 * @param {string} [params.description='Массив значений'] - Описание для свойства массива.
 * @param {Record<string, any> | string[]} [params.enum=UserRoleEnum] - enum если в items='enum'.
 * @param {'string' | 'number' | 'uuid' | 'email', 'enum'} [params.items='string'] - Тип элементов в массиве. Может быть либо 'string', либо 'number', либо 'uuid'.
 *
 */
export function ArrayPrimitiveProperty(params?: ArrayPrimitivePropertyDecoratorParams) {
  const nullable = params?.nullable || false;
  const isOptional = params?.isOptional || false;
  const minItems = params?.minItems !== undefined ? params.minItems : 1;
  const maxItems = params?.maxItems || 50;
  const description = params?.description || 'Массив значений';
  const items = params?.items === 'number' ? 'number' : 'string';

  const decorators = [];
  if (isOptional || nullable) {
    decorators.push(IsOptional());
  }

  if (items === 'string') {
    decorators.push(
      IsString({ each: true }),
      Type(() => String),
    );
  }

  if (items === 'number') {
    decorators.push(
      IsNumber({}, { each: true }),
      Type(() => Number),
    );
  }

  if (params.items === 'uuid') {
    decorators.push(
      IsUUID('all', { each: true }),
      Type(() => String),
    );
  }

  if (params.items === 'email') {
    decorators.push(
      IsEmail({}, { each: true }),
      Type(() => String),
    );
  }

  if (params.items === 'enum') {
    decorators.push(
      IsEnum(params.enum, { each: true }),
      Type(() => String),
    );
  }

  decorators.push(
    ArrayProperty({
      items: items,
      nullable: nullable,
      isOptional: isOptional,
      minItems: minItems,
      maxItems: maxItems,
      description: description,
    }),
    ArrayMinSize(minItems),
    ArrayMaxSize(maxItems),
    IsArray(),
  );

  return applyDecorators(...decorators);
}
