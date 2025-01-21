import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@domain/user/entities/user.entity';
import { GroupEntity } from '@domain/dicts/entities/group.entity';

@Entity('educations')
export class EducationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.educations, { nullable: false })
  user: UserEntity;

  @ManyToOne(() => GroupEntity, (group: GroupEntity) => group.educations, { nullable: false })
  group: GroupEntity;

  @CreateDateColumn()
  createdAt: Date;
}
