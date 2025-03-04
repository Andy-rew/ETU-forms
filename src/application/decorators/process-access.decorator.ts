import { applyDecorators, UseGuards } from '@nestjs/common';
import { ProcessMangerAccessGuard } from '@applications/guards/process-manger-access.guard';

export function ProcessManagerAccess() {
  const decorators = [];

  decorators.push(UseGuards(ProcessMangerAccessGuard));

  return applyDecorators(...decorators);
}
