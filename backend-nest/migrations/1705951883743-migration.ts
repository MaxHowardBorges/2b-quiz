import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1705951883743 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      ' INSERT INTO questionnary (title, authorId) VALUES ' +
        "('Quizz sur les frameworks',	3) ," +
        "('Quizz sur les base de données',	3)," +
        "('Quizz sur le modèle MVC',	3)",
    );

    await queryRunner.query(
      'INSERT INTO question (content, questionnaryId, type, authorId, originalId) VALUES ' +
        "('Quel est le rôle d\\'un framework dans le développement logiciel? ',	1,	'qcm',	3,	NULL)," +
        "(	'Quel framework est souvent utilisé pour le développement d\\'applications mobiles sur les plateformes iOS et Android?',	1,	'qcu',	3,	NULL)," +
        "(	'Donnez les avantages à l\\'utilisation d\\'un framework',	1,	'ouv',	3,	NULL)," +
        "(	'Qu\\'est-ce qu\\'une clé étrangère dans une base de données relationnelle? ',	2,	'qcm',	3,	NULL)," +
        "(	'Quelle contrainte de clé est utilisée pour garantir qu\\'aucune valeur en double n\\'est autorisée dans une colonne?',	2,	'qcu',	3,	NULL)," +
        "(	'Quel langage est souvent utilisé pour définir la structure et les relations des données dans une base de données relationnelle?',	2,	'qcu',	3,	NULL)," +
        "(	' Quels sont les rôles associés au Contrôleur dans le modèle MVC? ',	3,	'qcm',	3,	NULL)," +
        "(	'Quel est le rôle de la vue dans le modèle MVC?',	3,	'qcu',	3,	NULL)," +
        "(	'Quel est le rôle du contrôleur dans le modèle MVC?',	3,	'qcu',	3,	NULL);",
    );

    await queryRunner.query(
      'INSERT INTO answer(content, isCorrect, questionId) VALUES' +
        "    (	'Django',	0,	2)," +
        "    (	'Reacte Native',	1,	2)," +
        " (	'Ruby on Rails',	0,	2)," +
        "     (	'Laravel',	0,	2)," +
        "  (	'PRIMARY KEY',	0,	5)," +
        "   ('UNIQUE KEY',	1,	5)," +
        " (	'FOREIGN KEY',	0,	5)," +
        "  (	'CHECK KEY',	0,	5)," +
        " (	'SQL',	1,	6)," +
        "  (	'Python',	0,	6)," +
        "  (	'Java',	0,	6)," +
        "  (	'C++',	0,	6)," +
        " (	'Manipuler les données',	0,	8)," +
        " (	'Gérer la logique métier',	0,	8)," +
        "  (	'Présenter l\\'interface utilisateur',	1,	8)," +
        "    (	'Contrôler le flux de données ',	0,	8)," +
        " (	'Manipuler les données',	0,	9)," +
        "  (	'Présenter l\\'interface utilisateur',	0,	9)," +
        "  (	'Contrôler le flux de données',	1,	9)," +
        "  (	'Gérer la logique métier',	0,	9)," +
        "     (	'Gérer l\\'interface utilisateur',	1,	7)," +
        "  (	'Manipuler les données et la logique métier',	0,	7)," +
        "   (	'Contrôler le flux de données',	0,	7)," +
        " ('Gérer la logique métier',	0,	7)," +
        "   (	'Une clé qui garantit l\\'unicité des valeurs dans une colonne',	1,	4)," +
        " (	'Une clé qui identifie de manière unique chaque enregistrement dans une table',	0,	4)," +
        "          (	'Une clé qui établit une relation entre deux tables',	0,	4)," +
        "    (	' Une clé utilisée pour indexer les données et améliorer les performances de recherche',	0,	4)," +
        "          (	'Fournir une structure prédéfinie pour le développement d\\'applications',	1,	1)," +
        "  (	'Gérer la logique métier d\\'une application',	0,	1)," +
        "   (	'Faciliter la réutilisation du code source',	0,	1)," +
        " (	'Contrôler le matériel informatique sous-jacent',	0,	1);",
    );

    await queryRunner.query(
      'INSERT INTO tag (description, authorId) VALUES' +
        "('framework',	3)," +
        " ('SQL',	3)," +
        "   ('mvc',	3);",
    );

    await queryRunner.query(
      'INSERT INTO question_tags_tag (questionId, tagIdTag) VALUES' +
        '(1,	1),' +
        '(2,	1),' +
        '(3,	1),' +
        '(4,	2),' +
        '(5,	2),' +
        '(6,	2),' +
        '(7,	3),' +
        '(8,	3),' +
        '(9,	3);',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM answer;');
    await queryRunner.query('DELETE FROM question;');
    await queryRunner.query('DELETE FROM questionnary;');
    await queryRunner.query('DELETE FROM tag;');
  }
}
