import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GroupEntity } from '@domain/dicts/entities/group.entity';

@Entity('specialties')
export class SpecialtyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studyYears: string;

  @Column()
  cipher: string;

  @Column()
  title: string;

  @Column()
  lkId: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => GroupEntity, (group: GroupEntity) => group.specialty)
  groups: GroupEntity[];
}
