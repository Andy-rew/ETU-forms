import * as dotenv from 'dotenv';
import * as process from 'process';
import { Algorithm } from 'jsonwebtoken';

dotenv.config();

export type JwtAccessConfig = {
  accessSecret: string;
  accessExpireTime: string;
};

export type JwtRefreshConfig = {
  refreshSecret: string;
  refreshExpireTime: string;
};

export const accessTokenTitle = 'access-token';

export type Env = 'local' | 'dev' | 'stage' | 'prod' | 'test';

export type Server = {
  port: number;
  env: Env;
};

export type RecoveryCodeExpiration = {
  recoveryCodeExpireTime: number;
};

export type Configuration = {
  jwtAccess: JwtAccessConfig;
  jwtRefresh: JwtRefreshConfig;
  server: Server;
  recoveryCodeExpiration: RecoveryCodeExpiration;
};

export const loadConfiguration = (): Configuration => ({
  jwtAccess: {
    accessSecret: process.env.JWT_ACCESS_SECRET_KEY,
    accessExpireTime: process.env.JWT_ACCESS_EXPIRE_TIME,
  },
  jwtRefresh: {
    refreshSecret: process.env.JWT_REFRESH_SECRET_KEY,
    refreshExpireTime: process.env.JWT_REFRESH_EXPIRE_TIME,
  },
  server: {
    port: Number(process.env.PORT),
    env: process.env.ENVIRONMENT_NAME as Env,
  },
  recoveryCodeExpiration: {
    recoveryCodeExpireTime: Number(process.env.RECOVERY_CODE_EXPIRE_TIME),
  },
});
