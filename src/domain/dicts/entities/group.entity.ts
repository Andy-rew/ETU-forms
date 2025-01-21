import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SpecialtyEntity } from '@domain/dicts/entities/specialty.entity';
import { EducationEntity } from '@domain/user/entities/education.entity';

@Entity('groups')
export class GroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => SpecialtyEntity, (specialty: SpecialtyEntity) => specialty.groups, { nullable: false })
  specialty: SpecialtyEntity;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => EducationEntity, (education: EducationEntity) => education.group, { nullable: false })
  educations: EducationEntity[];
}
