import { plainToClass } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString({ message: 'API_VERSION must be a string' })
  API_VERSION: string;

  @IsString({ message: 'HOST must be a string' })
  HOST: string;

  @IsNumber({}, { message: 'PORT must be a number' })
  PORT: number;

  @IsString({ message: 'ENVIRONMENT_NAME must be a string' })
  ENVIRONMENT_NAME: string;

  @IsString({ message: 'DB_TYPE must be a string' })
  DB_TYPE: string;

  @IsString({ message: 'DB_HOST must be a string' })
  DB_HOST: string;

  @IsNumber({}, { message: 'DB_PORT must be a number' })
  DB_PORT: number;

  @IsString({ message: 'POSTGRES_USERNAME must be a string' })
  POSTGRES_USERNAME: string;

  @IsString({ message: 'POSTGRES_PASSWORD must be a string' })
  POSTGRES_PASSWORD: string;

  @IsString({ message: 'POSTGRES_DATABASE must be a string' })
  POSTGRES_DATABASE: string;

  @IsString({ message: 'JWT_ACCESS_SECRET_KEY must be a string' })
  JWT_ACCESS_SECRET_KEY: string;

  @IsNumber({}, { message: 'JWT_ACCESS_EXPIRE_TIME_MINUTES must be a number' })
  JWT_ACCESS_EXPIRE_TIME_MINUTES: number;

  @IsString({ message: 'JWT_REFRESH_SECRET_KEY must be a string' })
  JWT_REFRESH_SECRET_KEY: string;

  @IsNumber({}, { message: 'JWT_REFRESH_EXPIRE_TIME_MINUTES must be a number' })
  JWT_REFRESH_EXPIRE_TIME_MINUTES: number;

  @IsNumber({}, { message: 'RECOVERY_CODE_EXPIRE_TIME_MINUTES must be a number' })
  RECOVERY_CODE_EXPIRE_TIME_MINUTES: number;
}

export const validateEnv = (config: Record<string, unknown>) => {
  // `plainToClass` to converts plain object into Class
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  // `validateSync` method validate the class and returns errors
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};
