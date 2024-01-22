import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1703587771134 implements MigrationInterface {
    name = 'Migration1703587771134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`question\` ADD \`idAuthor\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`question\` ADD \`originalIdId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`question\` ADD CONSTRAINT \`FK_67f160fa1284501b3e524f67223\` FOREIGN KEY (\`originalIdId\`) REFERENCES \`question\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`question\` DROP FOREIGN KEY \`FK_67f160fa1284501b3e524f67223\``);
        await queryRunner.query(`ALTER TABLE \`question\` DROP COLUMN \`originalIdId\``);
        await queryRunner.query(`ALTER TABLE \`question\` DROP COLUMN \`idAuthor\``);
    }

}
