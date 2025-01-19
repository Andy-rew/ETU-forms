import { Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '@domain/user/entities/user.entity';

@Entity('system_admin')
export class SystemAdminEntity {
  @PrimaryColumn()
  userId: number;

  @OneToOne(() => UserEntity, (user: UserEntity) => user.systemAdmin)
  user: UserEntity;
}
