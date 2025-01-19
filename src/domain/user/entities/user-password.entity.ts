import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '@domain/user/entities/user.entity';

@Entity('user_password')
export class UserPasswordEntity {
  @PrimaryColumn()
  userId: number;

  @Column()
  password: string;

  @Column({ nullable: true })
  activationCode: string | null;

  @Column({ nullable: true, type: 'timestamptz' })
  activationCodeExpiredAt: Date | null;

  @OneToOne(() => UserEntity, (user: UserEntity) => user.password)
  user: UserEntity;
}
