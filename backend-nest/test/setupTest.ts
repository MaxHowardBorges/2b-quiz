import { createDatabase, dropDatabase } from 'typeorm-extension';
import { getDataSourceOptions } from './testDatabase.config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export async function createTestDatabase(
  testTypeOrmConfig: TypeOrmModuleOptions,
) {
  await createDatabase({
    ifNotExist: true,
    options: getDataSourceOptions(testTypeOrmConfig),
  });
}

export async function dropTestDatabase(
  testTypeOrmConfig: TypeOrmModuleOptions,
) {
  await dropDatabase({
    ifExist: true,
    options: getDataSourceOptions(testTypeOrmConfig),
  });
}
