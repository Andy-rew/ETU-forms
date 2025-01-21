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
import { StepExpertsParticipantsEntity } from '@domain/step/entities/step-experts-participants.entity';
import { SpecialtyEntity } from '@domain/dicts/entities/specialty.entity';
import { GroupEntity } from '@domain/dicts/entities/group.entity';
import { FacultyEntity } from '@domain/dicts/entities/faculty.entity';
import { DepartmentEntity } from '@domain/dicts/entities/department.entity';
import { CategoryEntity } from '@domain/dicts/entities/category.entity';
import { WorkPositionsEntity } from '@domain/dicts/entities/work-positions.entity';
import { EducationEntity } from '@domain/user/entities/education.entity';
import { UserDepartmentsEntity } from '@domain/user/entities/user-departments.entity';

export const EntitiesArray = [
  UserAuthTokensEntity,
  UserEntity,
  UserPasswordEntity,

  EducationEntity,
  UserDepartmentsEntity,

  SystemAdminEntity,
  ProcessesAdminEntity,

  FileEntity,

  ProcessEntity,
  ProcessParticipantEntity,
  ProcessManagersEntity,

  StepEntity,
  StepExpertsEntity,
  StepParticipantsEntity,
  StepExpertsParticipantsEntity,

  ReactionEntity,

  FormSchemaEntity,
  FormSchemaFilledEntity,
  FormSchemaUserTemplateEntity,

  SpecialtyEntity,
  GroupEntity,
  FacultyEntity,
  DepartmentEntity,
  CategoryEntity,
  WorkPositionsEntity,
];
