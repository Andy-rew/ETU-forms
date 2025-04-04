import { ConfigModule, ConfigService } from '@nestjs/config';
import { CONFIGS, Database, loadConfiguration } from '../../config/configuration/configuration';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntitiesArray } from '@infrastructure/entities.array';
import { validateEnv } from '@infrastructure/utils/environment.validation';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ProcessModule } from '@domain/process/process.module';
import { UserModule } from '@domain/user/user.module';
import { FileModule } from '@domain/file/file.module';
import { AuthModule } from '@domain/auth/auth.module';
import { MailerModule } from '@domain/mailer/mailer.module';
import { FormSchemaModule } from '@domain/form-schema/form-schema.module';
import { DictsModule } from '@domain/dicts/dicts.module';
import { ReactionModule } from '@domain/reaction/reaction.module';

export const ModuleImport = [
  ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
    load: [loadConfiguration],
    validate: validateEnv,
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      ({
        type: configService.get<Database>(CONFIGS.database).type,
        host: configService.get<Database>(CONFIGS.database).host,
        port: configService.get<Database>(CONFIGS.database).port,
        username: configService.get<Database>(CONFIGS.database).username,
        password: configService.get<Database>(CONFIGS.database).password,
        database: configService.get<Database>(CONFIGS.database).database,
        entities: EntitiesArray,
        synchronize: false,
        namingStrategy: new SnakeNamingStrategy(),
        // logger: 'simple-console',
      } as TypeOrmModuleOptions),
  }),
  ProcessModule,
  UserModule,
  FileModule,
  AuthModule,
  MailerModule,
  FormSchemaModule,
  DictsModule,
  ReactionModule,
];
