import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@applications/guards/auth.guard';

export const ROLES_KEY = 'roles';
export function AuthRoles(...roles: UserRoleEnum[]) {
  const decorators = [];

  decorators.push(SetMetadata(ROLES_KEY, roles));
  decorators.push(UseGuards(AuthGuard));

  return applyDecorators(...decorators);
}
