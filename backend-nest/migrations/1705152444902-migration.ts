import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1705152444902 implements MigrationInterface {
    name = 'Migration1705152444902'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`group\` (\`id\` int NOT NULL AUTO_INCREMENT, \`groupName\` varchar(255) NOT NULL, \`teacherId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_groups_group\` (\`userId\` int NOT NULL, \`groupId\` int NOT NULL, INDEX \`IDX_84ff6a520aee2bf2512c01cf46\` (\`userId\`), INDEX \`IDX_8abdfe8f9d78a4f5e821dbf620\` (\`groupId\`), PRIMARY KEY (\`userId\`, \`groupId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`group\` ADD CONSTRAINT \`FK_9a85fd90f7e33eb0265e76af9c7\` FOREIGN KEY (\`teacherId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_groups_group\` ADD CONSTRAINT \`FK_84ff6a520aee2bf2512c01cf462\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_groups_group\` ADD CONSTRAINT \`FK_8abdfe8f9d78a4f5e821dbf6203\` FOREIGN KEY (\`groupId\`) REFERENCES \`group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_groups_group\` DROP FOREIGN KEY \`FK_8abdfe8f9d78a4f5e821dbf6203\``);
        await queryRunner.query(`ALTER TABLE \`user_groups_group\` DROP FOREIGN KEY \`FK_84ff6a520aee2bf2512c01cf462\``);
        await queryRunner.query(`ALTER TABLE \`group\` DROP FOREIGN KEY \`FK_9a85fd90f7e33eb0265e76af9c7\``);
        await queryRunner.query(`DROP INDEX \`IDX_8abdfe8f9d78a4f5e821dbf620\` ON \`user_groups_group\``);
        await queryRunner.query(`DROP INDEX \`IDX_84ff6a520aee2bf2512c01cf46\` ON \`user_groups_group\``);
        await queryRunner.query(`DROP TABLE \`user_groups_group\``);
        await queryRunner.query(`DROP TABLE \`group\``);
    }

}
