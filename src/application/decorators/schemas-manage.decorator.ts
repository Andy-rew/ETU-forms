import { applyDecorators, SetMetadata } from '@nestjs/common';

export const SCHEMA_MANAGE = 'schemaManage';
export function SchemaManage() {
  return applyDecorators(SetMetadata(SCHEMA_MANAGE, true));
}
