import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@domain/user/entities/user.entity';

@Entity('user_auth_tokens')
export class UserAuthTokensEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  refreshToken: string;

  @Column()
  accessToken: string;

  @Column({ type: 'timestamptz' })
  accessTokenExpiredAt: Date;

  @Column({ type: 'timestamptz' })
  refreshTokenExpiredAt: Date;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.authTokens, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
