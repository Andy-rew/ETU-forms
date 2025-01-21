import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class CategoryEntity {
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
