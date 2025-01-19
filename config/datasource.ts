import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { EntitiesArray } from '@infrastructure/entities.array';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: EntitiesArray,
  migrations: ['src/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  namingStrategy: new SnakeNamingStrategy(),
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
