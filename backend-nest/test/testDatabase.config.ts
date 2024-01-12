import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';
const testTypeOrmConfig: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: 'localhost',
  port: 3307,
  username: 'root',
  password: 'example',
  database: 'testsae5' + Math.floor(Math.random() * 1000000),
  entities: [join(__dirname + '/..') + '/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
  dropSchema: true,
  migrationsTransactionMode: 'all',
};

function getDataSourceOptions(
  testConfig: TypeOrmModuleOptions,
): DataSourceOptions {
  return {
    type: 'mariadb',
    database: testConfig.database.toString(),
    host: 'localhost',
    port: 3307,
    username: 'root',
    password: 'example',
  };
}

export { testTypeOrmConfig, getDataSourceOptions };
