import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsBoolean, IsEmail, IsEnum, IsNumber, IsPhoneNumber } from 'class-validator';
import { UserAuthTokensEntity } from '@domain/user/entities/user-auth-tokens.entity';
import { UserPasswordEntity } from '@domain/user/entities/user-password.entity';
import { SystemAdminEntity } from '@domain/user/entities/system-admin.entity';
import { ProcessesAdminEntity } from '@domain/user/entities/processes-admin.entity';
import { FormSchemaUserTemplateEntity } from '@domain/form-schema/entities/form-schema-user-template.entity';
import { UserStatusEnum } from '@domain/user/enums/user-status.enum';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { ProcessParticipantEntity } from '@domain/process/entities/process-participant.entity';
import { ProcessManagersEntity } from '@domain/process/entities/process-managers.entity';
import { StepExpertsEntity } from '@domain/step/entities/step-experts.entity';
import { ReactionEntity } from '@domain/reaction/entities/reaction.entity';
import { EducationEntity } from '@domain/user/entities/education.entity';
import { UserDepartmentsEntity } from '@domain/user/entities/user-departments.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string | null;

  @Column({ nullable: true })
  surname: string | null;

  @Column({ nullable: true })
  patronymic: string | null;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ nullable: true, unique: true })
  @IsPhoneNumber()
  phone: string | null;

  @Column({ nullable: true, unique: true })
  @IsNumber()
  etuId: number | null;

  @Column({ type: 'enum', enum: UserStatusEnum, default: UserStatusEnum.invited })
  @IsEnum(UserStatusEnum)
  status: UserStatusEnum;

  @Column({
    type: 'enum',
    array: true,
    enum: UserRoleEnum,
    default: [UserRoleEnum.user],
  })
  @IsEnum(UserRoleEnum, { each: true })
  roles: UserRoleEnum[];

  @Column({ default: false })
  @IsBoolean()
  allowTemplates: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => UserAuthTokensEntity, (authToken) => authToken.user)
  authTokens: UserAuthTokensEntity[];

  @OneToOne(() => UserPasswordEntity, (password) => password.user)
  password: UserPasswordEntity;

  @OneToOne(() => SystemAdminEntity, (systemAdmin) => systemAdmin.user)
  systemAdmin: SystemAdminEntity;

  @OneToOne(() => ProcessesAdminEntity, (processAdmin) => processAdmin.user)
  processesAdmin: ProcessesAdminEntity;

  @OneToMany(() => FormSchemaUserTemplateEntity, (schemaTemplate: FormSchemaUserTemplateEntity) => schemaTemplate.user)
  schemaTemplates: FormSchemaUserTemplateEntity[];

  @OneToMany(() => ProcessParticipantEntity, (participant: ProcessParticipantEntity) => participant.user)
  processParticipants: ProcessParticipantEntity[];

  @OneToMany(() => ProcessManagersEntity, (manager: ProcessManagersEntity) => manager.user)
  processManagers: ProcessManagersEntity[];

  @OneToMany(() => StepExpertsEntity, (stepExpert: StepExpertsEntity) => stepExpert.user)
  stepExperts: StepExpertsEntity[];

  @OneToMany(() => ReactionEntity, (reaction: ReactionEntity) => reaction.reactedByUser)
  reactions: ReactionEntity[];

  @OneToMany(() => EducationEntity, (education: EducationEntity) => education.user)
  educations: EducationEntity[];

  @OneToMany(() => UserDepartmentsEntity, (userDepartments: UserDepartmentsEntity) => userDepartments.user)
  userDepartments: UserDepartmentsEntity[];
}
