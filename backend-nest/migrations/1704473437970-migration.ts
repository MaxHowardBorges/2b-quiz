import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1704473437970 implements MigrationInterface {
  name = 'Migration1704473437970';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`questionnary\` CHANGE \`author\` \`authorId\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`questionnary\` DROP COLUMN \`authorId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`questionnary\` ADD \`authorId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`questionnary\` ADD CONSTRAINT \`FK_56ffc9bda6d52c8d922e309fe57\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    //adapt data to first Teacher in user
    await queryRunner.query(
      `UPDATE \`questionnary\` SET \`authorId\` = (SELECT id FROM \`user\` WHERE type = 'Teacher' AND deleted = 0 LIMIT 1) WHERE \`authorId\` IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`questionnary\` DROP FOREIGN KEY \`FK_56ffc9bda6d52c8d922e309fe57\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`questionnary\` DROP COLUMN \`authorId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`questionnary\` ADD \`authorId\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`questionnary\` CHANGE \`authorId\` \`author\` varchar(255) NOT NULL`,
    );
  }
}
