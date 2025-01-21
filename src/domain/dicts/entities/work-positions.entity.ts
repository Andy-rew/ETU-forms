import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('work_positions')
export class WorkPositionsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  shortTitle: string;

  @Column()
  lkId: number;

  @CreateDateColumn()
  createdAt: Date;
}
