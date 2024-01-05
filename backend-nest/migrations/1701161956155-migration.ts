import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1701161956155 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "INSERT INTO questionnary (title, author) VALUES ('Quiz sur les capitales', 'Jean-Michel');",
    );
    await queryRunner.query(
      'UPDATE question SET questionnaryId = (SELECT id FROM questionnary ORDER BY id DESC LIMIT 1) WHERE questionnaryId IS NULL;',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
