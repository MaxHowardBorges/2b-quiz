import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1705410659842 implements MigrationInterface {
    name = 'Migration1705410659842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_joined_groups_group\` (\`userId\` int NOT NULL, \`groupId\` int NOT NULL, INDEX \`IDX_bf57a62f72feabf1771fb53e1f\` (\`userId\`), INDEX \`IDX_93cd4f6c3f0b05ad3e6d40a4d8\` (\`groupId\`), PRIMARY KEY (\`userId\`, \`groupId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_joined_groups_group\` ADD CONSTRAINT \`FK_bf57a62f72feabf1771fb53e1f5\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_joined_groups_group\` ADD CONSTRAINT \`FK_93cd4f6c3f0b05ad3e6d40a4d8b\` FOREIGN KEY (\`groupId\`) REFERENCES \`group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_joined_groups_group\` DROP FOREIGN KEY \`FK_93cd4f6c3f0b05ad3e6d40a4d8b\``);
        await queryRunner.query(`ALTER TABLE \`user_joined_groups_group\` DROP FOREIGN KEY \`FK_bf57a62f72feabf1771fb53e1f5\``);
        await queryRunner.query(`DROP INDEX \`IDX_93cd4f6c3f0b05ad3e6d40a4d8\` ON \`user_joined_groups_group\``);
        await queryRunner.query(`DROP INDEX \`IDX_bf57a62f72feabf1771fb53e1f\` ON \`user_joined_groups_group\``);
        await queryRunner.query(`DROP TABLE \`user_joined_groups_group\``);
    }

}
