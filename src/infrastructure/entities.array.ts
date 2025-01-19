import { UserAuthTokensEntity } from '@domain/user/entities/user-auth-tokens.entity';
import { UserEntity } from '@domain/user/entities/user.entity';
import { UserPasswordEntity } from '@domain/user/entities/user-password.entity';
import { FileEntity } from '@domain/file/entities/file.entity';
import { SystemAdminEntity } from '@domain/user/entities/system-admin.entity';
import { ProcessesAdminEntity } from '@domain/user/entities/processes-admin.entity';
import { ProcessEntity } from '@domain/process/entities/process.entity';
import { FormSchemaEntity } from '@domain/form-schema/entities/form-schema.entity';
import { FormSchemaFilledEntity } from '@domain/form-schema/entities/form-schema-filled.entity';
import { FormSchemaUserTemplateEntity } from '@domain/form-schema/entities/form-schema-user-template.entity';
import { ProcessParticipantEntity } from '@domain/process/entities/process-participant.entity';
import { ProcessManagersEntity } from '@domain/process/entities/process-managers.entity';
import { StepEntity } from '@domain/step/entities/step.entity';
import { StepExpertsEntity } from '@domain/step/entities/step-experts.entity';
import { StepParticipantsEntity } from '@domain/step/entities/step-participants.entity';
import { ReactionEntity } from '@domain/reaction/entities/reaction.entity';

export const EntitiesArray = [
  UserAuthTokensEntity,
  UserEntity,
  UserPasswordEntity,

  SystemAdminEntity,
  ProcessesAdminEntity,

  FileEntity,

  ProcessEntity,
  ProcessParticipantEntity,
  ProcessManagersEntity,

  StepEntity,
  StepExpertsEntity,
  StepParticipantsEntity,

  ReactionEntity,

  FormSchemaEntity,
  FormSchemaFilledEntity,
  FormSchemaUserTemplateEntity,
];
