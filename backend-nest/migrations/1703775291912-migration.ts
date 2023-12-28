import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1703775291912 implements MigrationInterface {
    name = 'Migration1703775291912'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`question\` DROP FOREIGN KEY \`FK_67f160fa1284501b3e524f67223\``);
        await queryRunner.query(`ALTER TABLE \`question\` CHANGE \`originalIdId\` \`originalId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`questionnary\` DROP COLUMN \`author\``);
        await queryRunner.query(`ALTER TABLE \`questionnary\` ADD \`author\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`question\` ADD CONSTRAINT \`FK_60c88e33b502128e84b30ce45ed\` FOREIGN KEY (\`originalId\`) REFERENCES \`question\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`question\` DROP FOREIGN KEY \`FK_60c88e33b502128e84b30ce45ed\``);
        await queryRunner.query(`ALTER TABLE \`questionnary\` DROP COLUMN \`author\``);
        await queryRunner.query(`ALTER TABLE \`questionnary\` ADD \`author\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`question\` CHANGE \`originalId\` \`originalIdId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`question\` ADD CONSTRAINT \`FK_67f160fa1284501b3e524f67223\` FOREIGN KEY (\`originalIdId\`) REFERENCES \`question\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
