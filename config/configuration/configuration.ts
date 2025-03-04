import * as dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

export type JwtAccessConfig = {
  accessSecret: string;
  accessExpireTimeMinutes: string;
};

export type JwtRefreshConfig = {
  refreshSecret: string;
  refreshExpireTimeMinutes: string;
};

export const accessTokenTitle = 'access-token';

export type Env = 'local' | 'dev' | 'stage' | 'prod' | 'test';

export type Server = {
  port: number;
  env: Env;
};

export type RecoveryCodeExpiration = {
  recoveryCodeExpireTimeMinutes: number;
};

export type Database = {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

export type Configuration = {
  jwtAccess: JwtAccessConfig;
  jwtRefresh: JwtRefreshConfig;
  server: Server;
  recoveryCodeExpiration: RecoveryCodeExpiration;
  database: Database;
};

export const loadConfiguration = (): Configuration => ({
  jwtAccess: {
    accessSecret: process.env.JWT_ACCESS_SECRET_KEY,
    accessExpireTimeMinutes: process.env.JWT_ACCESS_EXPIRE_TIME_MINUTES,
  },
  jwtRefresh: {
    refreshSecret: process.env.JWT_REFRESH_SECRET_KEY,
    refreshExpireTimeMinutes: process.env.JWT_REFRESH_EXPIRE_TIME_MINUTES,
  },
  server: {
    port: Number(process.env.PORT),
    env: process.env.ENVIRONMENT_NAME as Env,
  },
  recoveryCodeExpiration: {
    recoveryCodeExpireTimeMinutes: Number(process.env.RECOVERY_CODE_EXPIRE_TIME_MINUTES),
  },
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
  },
});

export const CONFIGS: { [K in keyof Configuration]: K } = {
  jwtAccess: 'jwtAccess',
  jwtRefresh: 'jwtRefresh',
  server: 'server',
  recoveryCodeExpiration: 'recoveryCodeExpiration',
  database: 'database',
};
