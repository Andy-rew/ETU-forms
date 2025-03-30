import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthRoles } from '@applications/decorators/auth-roles.decorator';
import { ProcessMangerAccessGuard } from '@applications/guards/process-manger-access.guard';
import { ProcessParticipantAccessGuard } from '@applications/guards/process-participant.access.guard';
import { AuthGuard } from '@applications/guards/auth.guard';
import { AllowSchemaTemplateGuard } from '@applications/guards/allow-schema-template.guard';
import { MySchemaManageGuard } from '@applications/guards/my-schema-manage.guard';
import { ProcessStepParticipantAccessGuard } from '@applications/guards/process-step-participant.access.guard';
import { ProcessExpertAccessGuard } from '@applications/guards/process-expert-access.guard';
import { ProcessStepExpertAccessGuard } from '@applications/guards/process-step-expert-access.guard';
import { ProcessStepMainExpertAccessGuard } from '@applications/guards/process-step-main-expert-access.guard';

export function MyApiOperation(dto: {
  anyRole?: boolean;
  roles?: UserRoleEnum[];
  rights?: {
    process?: {
      manager?: boolean;
      expert?: boolean;
      participant?: boolean;
    };
    step?: {
      participant?: boolean;
      expert?: boolean;
      mainExpert?: boolean;
    };
    schema?: {
      allowTemplates?: boolean;
      mySchemas?: boolean;
    };
  };
}) {
  const decorators = [];
  if (dto.anyRole && dto.roles) {
    throw new Error('Only one of "anyRole" or "roles" can be passed');
  }

  decorators.push(UseGuards(AuthGuard));

  if (dto.anyRole) {
    decorators.push(AuthRoles());
  }

  if (dto.roles) {
    decorators.push(AuthRoles(...dto.roles));
  }

  if (dto.rights) {
    if (dto.rights.process) {
      if (dto.rights.process.manager) {
        decorators.push(AuthRoles(UserRoleEnum.processAdmin, UserRoleEnum.user));
        decorators.push(UseGuards(ProcessMangerAccessGuard));
      }

      if (dto.rights.process.expert) {
        decorators.push(UseGuards(ProcessExpertAccessGuard));
      }

      if (dto.rights.process.participant) {
        decorators.push(UseGuards(ProcessParticipantAccessGuard));
      }
    }

    if (dto.rights.step) {
      if (dto.rights.step.participant) {
        decorators.push(UseGuards(ProcessStepParticipantAccessGuard));
      }

      if (dto.rights.step.expert) {
        decorators.push(UseGuards(ProcessStepExpertAccessGuard));
      }

      if (dto.rights.step.mainExpert) {
        decorators.push(UseGuards(ProcessStepMainExpertAccessGuard));
      }
    }

    if (dto.rights.schema) {
      if (dto.rights.schema.allowTemplates) {
        decorators.push(UseGuards(AllowSchemaTemplateGuard));
      }

      if (dto.rights.schema.mySchemas) {
        decorators.push(UseGuards(AllowSchemaTemplateGuard));
        decorators.push(UseGuards(MySchemaManageGuard));
      }
    }
  }

  return applyDecorators(...decorators);
}
