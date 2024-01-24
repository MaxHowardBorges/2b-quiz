import { faker } from '@faker-js/faker/locale/fr';
import { Question } from '../../src/question/entity/question.entity';
import { Questionnary } from '../../src/questionnary/entity/questionnary.entity';
import { QuestionType } from '../../src/question/constants/questionType.constant';
import { Teacher } from '../../src/user/entity/teacher.entity';

export function generateQuestionnaryMock(teacher: Teacher) {
  const questionnary = new Questionnary();
  questionnary.id = undefined;
  questionnary.title = faker.lorem.sentence(2);
  questionnary.questions = generateQuestionMockList(teacher, 10);
  return questionnary;
}

export function generateQuestionMockList(teacher: Teacher, number: number) {
  const questionList = [];
  for (let i = 0; i < number; i++) {
    questionList.push(generateQuestionMock(teacher));
  }
  return questionList;
}

export function generateQuestionMock(teacher: Teacher) {
  const question = new Question();
  question.id = undefined;
  question.content = faker.lorem.sentence(5);
  question.type = QuestionType.QCU;
  question.answers = generateAnswerMockList(10);
  question.originalQuestion = undefined;
  question.originalId = undefined;
  question.author = teacher;
  return question;
}

export function generateAnswerMockList(number: number) {
  const answerList = [];
  for (let i = 0; i < number; i++) {
    answerList.push(generateAnswerMock());
  }
  return answerList;
}

export function generateAnswerMock() {
  return {
    id: undefined,
    content: faker.lorem.sentence(5),
    isCorrect: false,
  };
}
