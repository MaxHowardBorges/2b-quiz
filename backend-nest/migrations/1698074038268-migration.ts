import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1698074038268 implements MigrationInterface {
    name = 'Migration1698074038268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`questionnary\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`author\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`question\` ADD \`questionnaryId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`question\` ADD CONSTRAINT \`FK_56a8bb532b527860644ea1ae902\` FOREIGN KEY (\`questionnaryId\`) REFERENCES \`questionnary\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`question\` DROP FOREIGN KEY \`FK_56a8bb532b527860644ea1ae902\``);
        await queryRunner.query(`ALTER TABLE \`question\` DROP COLUMN \`questionnaryId\``);
        await queryRunner.query(`DROP TABLE \`questionnary\``);
    }

}
