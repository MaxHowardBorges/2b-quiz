import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1703237468987 implements MigrationInterface {
    name = 'Migration1703237468987'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`questionnary\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`author\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tag\` (\`idTag\` int NOT NULL AUTO_INCREMENT, \`description\` varchar(255) NOT NULL, PRIMARY KEY (\`idTag\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`question\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` varchar(255) NOT NULL, \`questionnaryId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`answer\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` varchar(255) NOT NULL, \`isCorrect\` tinyint NOT NULL, \`questionId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`question_tags_tag\` (\`questionId\` int NOT NULL, \`tagIdTag\` int NOT NULL, INDEX \`IDX_fa1cf45c0ee075fd02b0009a0d\` (\`questionId\`), INDEX \`IDX_bffc0d92f65a96dabc88e41811\` (\`tagIdTag\`), PRIMARY KEY (\`questionId\`, \`tagIdTag\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`question\` ADD CONSTRAINT \`FK_56a8bb532b527860644ea1ae902\` FOREIGN KEY (\`questionnaryId\`) REFERENCES \`questionnary\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`answer\` ADD CONSTRAINT \`FK_a4013f10cd6924793fbd5f0d637\` FOREIGN KEY (\`questionId\`) REFERENCES \`question\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`question_tags_tag\` ADD CONSTRAINT \`FK_fa1cf45c0ee075fd02b0009a0d4\` FOREIGN KEY (\`questionId\`) REFERENCES \`question\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`question_tags_tag\` ADD CONSTRAINT \`FK_bffc0d92f65a96dabc88e418114\` FOREIGN KEY (\`tagIdTag\`) REFERENCES \`tag\`(\`idTag\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`question_tags_tag\` DROP FOREIGN KEY \`FK_bffc0d92f65a96dabc88e418114\``);
        await queryRunner.query(`ALTER TABLE \`question_tags_tag\` DROP FOREIGN KEY \`FK_fa1cf45c0ee075fd02b0009a0d4\``);
        await queryRunner.query(`ALTER TABLE \`answer\` DROP FOREIGN KEY \`FK_a4013f10cd6924793fbd5f0d637\``);
        await queryRunner.query(`ALTER TABLE \`question\` DROP FOREIGN KEY \`FK_56a8bb532b527860644ea1ae902\``);
        await queryRunner.query(`DROP INDEX \`IDX_bffc0d92f65a96dabc88e41811\` ON \`question_tags_tag\``);
        await queryRunner.query(`DROP INDEX \`IDX_fa1cf45c0ee075fd02b0009a0d\` ON \`question_tags_tag\``);
        await queryRunner.query(`DROP TABLE \`question_tags_tag\``);
        await queryRunner.query(`DROP TABLE \`answer\``);
        await queryRunner.query(`DROP TABLE \`question\``);
        await queryRunner.query(`DROP TABLE \`tag\``);
        await queryRunner.query(`DROP TABLE \`questionnary\``);
    }

}
