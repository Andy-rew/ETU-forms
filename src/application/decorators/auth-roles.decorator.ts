import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from '@applications/guards/roles.guard';

export const ROLES_KEY = 'roles';
export function AuthRoles(...roles: UserRoleEnum[]) {
  const decorators = [];

  decorators.push(SetMetadata(ROLES_KEY, roles));
  decorators.push(UseGuards(RolesGuard));

  return applyDecorators(...decorators);
}
