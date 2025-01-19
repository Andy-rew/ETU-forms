import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsPhoneNumber,
} from 'class-validator';
import { UserAuthTokensEntity } from '@domain/user/entities/user-auth-tokens.entity';

export enum UserStatus {
  invited = 'invited',
  activated = 'activated',
}

export enum UserRole {
  user = 'user',
  processAdmin = 'processAdmin',
  systemAdmin = 'systemAdmin',
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ nullable: true, unique: true })
  @IsPhoneNumber()
  phone: string | null;

  @Column({ nullable: true, unique: true })
  @IsNumber()
  etuId: number | null;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.invited })
  @IsEnum(UserStatus)
  status: UserStatus;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.user })
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  @IsBoolean()
  allowTemplates: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => UserAuthTokensEntity, (authToken) => authToken.user)
  authTokens: UserAuthTokensEntity[];
}
