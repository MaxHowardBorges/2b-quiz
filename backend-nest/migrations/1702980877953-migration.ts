import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1702980877953 implements MigrationInterface {
    name = 'Migration1702980877953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tag\` (\`idTag\` int NOT NULL AUTO_INCREMENT, \`description\` varchar(255) NOT NULL, PRIMARY KEY (\`idTag\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`question_tags_tag\` (\`questionId\` int NOT NULL, \`tagIdTag\` int NOT NULL, INDEX \`IDX_fa1cf45c0ee075fd02b0009a0d\` (\`questionId\`), INDEX \`IDX_bffc0d92f65a96dabc88e41811\` (\`tagIdTag\`), PRIMARY KEY (\`questionId\`, \`tagIdTag\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`question_tags_tag\` ADD CONSTRAINT \`FK_fa1cf45c0ee075fd02b0009a0d4\` FOREIGN KEY (\`questionId\`) REFERENCES \`question\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`question_tags_tag\` ADD CONSTRAINT \`FK_bffc0d92f65a96dabc88e418114\` FOREIGN KEY (\`tagIdTag\`) REFERENCES \`tag\`(\`idTag\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`question_tags_tag\` DROP FOREIGN KEY \`FK_bffc0d92f65a96dabc88e418114\``);
        await queryRunner.query(`ALTER TABLE \`question_tags_tag\` DROP FOREIGN KEY \`FK_fa1cf45c0ee075fd02b0009a0d4\``);
        await queryRunner.query(`DROP INDEX \`IDX_bffc0d92f65a96dabc88e41811\` ON \`question_tags_tag\``);
        await queryRunner.query(`DROP INDEX \`IDX_fa1cf45c0ee075fd02b0009a0d\` ON \`question_tags_tag\``);
        await queryRunner.query(`DROP TABLE \`question_tags_tag\``);
        await queryRunner.query(`DROP TABLE \`tag\``);
    }

}
