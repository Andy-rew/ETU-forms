import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '@domain/user/entities/user.entity';

@Entity('user_password')
export class UserPasswordEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  activationCode: string | null;

  @Column({ nullable: true, type: 'timestamptz' })
  activationCodeExpiredAt: Date | null;

  @OneToOne(() => UserEntity, (user: UserEntity) => user.password)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
