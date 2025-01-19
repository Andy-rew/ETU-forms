import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserEntity } from '@domain/user/entities/user.entity';
import { ProcessEntity } from '@domain/process/entities/process.entity';

@Entity('process_managers')
@Unique('user-process-manager', ['user', 'process'])
export class ProcessManagersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.processManagers, { nullable: false })
  user: UserEntity;

  @ManyToOne(() => ProcessEntity, (process: ProcessEntity) => process.userManagers, { nullable: false })
  process: ProcessEntity;
}
