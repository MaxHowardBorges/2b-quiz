import { MigrationInterface, QueryRunner } from 'typeorm';
import * as usersData from './../user.json';
import { escape } from 'sqlstring';

export class Migration1700414108344 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query =
      'INSERT INTO user (username,name,surname,validate,type) VALUES ';
    for (let i = 0; i < usersData.length; i++) {
      const user = usersData[i];
      await queryRunner.query(query + this.getValueFrom(user) + ';');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}

  public getValueFrom(user: any) {
    return (
      '(' +
      escape(user.username) +
      ',' +
      escape(user.name) +
      ',' +
      escape(user.surname) +
      ',' +
      user.validate +
      ",'" +
      user.userType +
      "')"
    );
  }
}
