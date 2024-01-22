import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1705159390773 implements MigrationInterface {
  name = 'Migration1705159390773';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`question\` CHANGE \`idAuthor\` \`authorId\` int NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`tag\` ADD \`authorId\` int NULL`);
    await queryRunner.query(
      `UPDATE \`question\` SET \`authorId\` = (SELECT id FROM \`user\` WHERE type = 'Teacher' AND deleted = 0 LIMIT 1) WHERE \`authorId\` IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`question\` CHANGE \`authorId\` \`authorId\` int NULL`,
    );
    await queryRunner.query(
      `UPDATE \`question\` SET \`authorId\` = (SELECT id FROM \`user\` WHERE type = 'Teacher' AND deleted = 0 LIMIT 1) WHERE \`authorId\` = 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tag\` ADD CONSTRAINT \`FK_9e7e912c496407e930276dff88c\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`question\` ADD CONSTRAINT \`FK_75fc761f2752712276be38e7d13\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`question\` DROP FOREIGN KEY \`FK_75fc761f2752712276be38e7d13\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tag\` DROP FOREIGN KEY \`FK_9e7e912c496407e930276dff88c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`question\` CHANGE \`authorId\` \`authorId\` int NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`tag\` DROP COLUMN \`authorId\``);
    await queryRunner.query(
      `ALTER TABLE \`question\` CHANGE \`authorId\` \`idAuthor\` int NOT NULL`,
    );
  }
}
