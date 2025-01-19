import { Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '@domain/user/entities/user.entity';

@Entity('processes_admin')
export class ProcessesAdminEntity {
  @PrimaryColumn()
  userId: number;

  @OneToOne(() => UserEntity, (user: UserEntity) => user.processesAdmin)
  user: UserEntity;
}
