import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1704997266427 implements MigrationInterface {
    name = 'Migration1704997266427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`session\` (\`id\` int NOT NULL AUTO_INCREMENT, \`teacher\` varchar(255) NOT NULL, \`isResult\` tinyint NOT NULL, \`isGlobal\` tinyint NOT NULL, \`isAvailableAfter\` tinyint NOT NULL, \`date\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(), \`questionnaryId\` int NULL, UNIQUE INDEX \`REL_59c3b562e89b59ec72e80061f1\` (\`questionnaryId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_session\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user\` varchar(255) NOT NULL, \`sessionId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_session_answer_answer\` (\`userSessionId\` int NOT NULL, \`answerId\` int NOT NULL, INDEX \`IDX_ae958595680f4ca3cb61719727\` (\`userSessionId\`), INDEX \`IDX_6dc39c516a73ca077ac8da4431\` (\`answerId\`), PRIMARY KEY (\`userSessionId\`, \`answerId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`session\` ADD CONSTRAINT \`FK_59c3b562e89b59ec72e80061f17\` FOREIGN KEY (\`questionnaryId\`) REFERENCES \`questionnary\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_session\` ADD CONSTRAINT \`FK_122ac0140676b89411d43901c5d\` FOREIGN KEY (\`sessionId\`) REFERENCES \`session\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_session_answer_answer\` ADD CONSTRAINT \`FK_ae958595680f4ca3cb61719727a\` FOREIGN KEY (\`userSessionId\`) REFERENCES \`user_session\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_session_answer_answer\` ADD CONSTRAINT \`FK_6dc39c516a73ca077ac8da44315\` FOREIGN KEY (\`answerId\`) REFERENCES \`answer\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_session_answer_answer\` DROP FOREIGN KEY \`FK_6dc39c516a73ca077ac8da44315\``);
        await queryRunner.query(`ALTER TABLE \`user_session_answer_answer\` DROP FOREIGN KEY \`FK_ae958595680f4ca3cb61719727a\``);
        await queryRunner.query(`ALTER TABLE \`user_session\` DROP FOREIGN KEY \`FK_122ac0140676b89411d43901c5d\``);
        await queryRunner.query(`ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_59c3b562e89b59ec72e80061f17\``);
        await queryRunner.query(`DROP INDEX \`IDX_6dc39c516a73ca077ac8da4431\` ON \`user_session_answer_answer\``);
        await queryRunner.query(`DROP INDEX \`IDX_ae958595680f4ca3cb61719727\` ON \`user_session_answer_answer\``);
        await queryRunner.query(`DROP TABLE \`user_session_answer_answer\``);
        await queryRunner.query(`DROP TABLE \`user_session\``);
        await queryRunner.query(`DROP INDEX \`REL_59c3b562e89b59ec72e80061f1\` ON \`session\``);
        await queryRunner.query(`DROP TABLE \`session\``);
    }

}
