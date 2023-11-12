import { MigrationInterface, QueryRunner } from 'typeorm';
import { fakerFR as faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

export class Migration1699791089837 implements MigrationInterface {
  private static NB_ADMIN = 3;
  private static NB_TEACHER = 15;
  private static NB_STUDENT = 80;
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query =
      'INSERT INTO user (username,password,name,surname,validate,type) VALUES ';
    await queryRunner.query(
      query +
        `('admin','${await bcrypt.hash(
          'azerty',
          10,
        )}','Admin','super',TRUE,'admin')` +
        ';',
    );
    for (let i = 1; i < Migration1699791089837.NB_ADMIN; i++) {
      await queryRunner.query(query + (await this.userGenerate('Admin')) + ';');
    }
    for (let i = 0; i < Migration1699791089837.NB_TEACHER; i++) {
      await queryRunner.query(
        query + (await this.userGenerate('Teacher')) + ';',
      );
    }
    for (let i = 0; i < Migration1699791089837.NB_STUDENT; i++) {
      await queryRunner.query(
        query + (await this.userGenerate('Student')) + ';',
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM user;');
  }

  async userGenerate(userRole: string) {
    const name = faker.person.firstName();
    const surname = faker.person.lastName();
    const password = await bcrypt.hash('azerty', 10);
    const username = faker.internet.userName({
      firstName: name,
      lastName: surname,
    });
    return `('${username.replace("'", "''")}','${password}','${name.replace(
      "'",
      "''",
    )}','${surname.replace("'", "''")}',TRUE,'${userRole}')`;
  }
}
