import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1701955132842 implements MigrationInterface {
    name = 'Migration1701955132842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`question\` ADD \`type\` varchar(255) NOT NULL DEFAULT 'qcu'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`question\` DROP COLUMN \`type\``);
    }

}
