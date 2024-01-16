import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1704838510326 implements MigrationInterface {
    name = 'Migration1704838510326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`askedDelete\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`askedDelete\``);
    }

}
