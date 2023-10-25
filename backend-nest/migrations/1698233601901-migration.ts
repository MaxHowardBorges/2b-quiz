import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1698233601901 implements MigrationInterface {
  name = 'Migration1698233601901';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`validate\` \`validate\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`validate\` \`validate\` tinyint NOT NULL`,
    );
  }
}
