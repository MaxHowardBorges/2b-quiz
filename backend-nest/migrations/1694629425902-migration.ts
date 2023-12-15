import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1694629425902 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'INSERT INTO question (content) VALUES ' +
        "('Quelle est la capitale de la France?'), " +
        '(\'Qui a écrit "Romeo et Juliette"?\'), ' +
        "('Quel est le symbole chimique de l\\'oxygène?');",
    );

    await queryRunner.query(
      'INSERT INTO answer (content, isCorrect, questionId) VALUES ' +
        "('Paris', 1, 1), " +
        "('Londres', 0, 1), " +
        "('Berlin', 0, 1), " +
        "('William Shakespeare', 1, 2), " +
        "('Charles Dickens', 0, 2), " +
        "('Jane Austen', 0, 2), " +
        "('George Orwell', 0, 2), " +
        "('O', 1, 3), " +
        "('H', 0, 3), " +
        "('C', 0, 3), " +
        "('N', 0, 3), " +
        "('S', 0, 3);",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM answer');
    await queryRunner.query('DELETE FROM question');
  }
}
