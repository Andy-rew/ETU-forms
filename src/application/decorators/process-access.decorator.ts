import { applyDecorators, UseGuards } from '@nestjs/common';
import { ProcessMangerAccessGuard } from '@applications/guards/process-manger-access.guard';
import { ProcessUserRoleEnum } from '@domain/process/enums/process-user-role.enum';
import { AuthRoles } from '@applications/decorators/auth-roles.decorator';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';

export function ProcessAccess(role: ProcessUserRoleEnum) {
  const decorators = [];

  switch (role) {
    case ProcessUserRoleEnum.manager:
      decorators.push(AuthRoles(UserRoleEnum.processAdmin, UserRoleEnum.user));
      decorators.push(UseGuards(ProcessMangerAccessGuard));
      break;

    case ProcessUserRoleEnum.expert:
      break;

    case ProcessUserRoleEnum.participant:
      break;
  }

  return applyDecorators(...decorators);
}
