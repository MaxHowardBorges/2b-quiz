// id, liste question, nomero question, string[] connecté

import { Question } from '../question/entity/question.entity';

export class Session {
  id: string;

  private questionList: Question[];

  private questionNumber: number;

  private connectedUsers: string[];

  constructor(id: string, questionList: Question[]) {
    this.id = id;
    this.questionList = questionList;
    this.questionNumber = -1;
  }

  get getQuestionList(): Question[] {
    return this.questionList;
  }

  set setQuestionList(value: Question[]) {
    this.questionList = value;
  }

  get getQuestionNumber(): number {
    return this.questionNumber;
  }

  set setQuestionNumber(value: number) {
    this.questionNumber = value;
  }

  get getConnectedUsers(): string[] {
    return this.connectedUsers;
  }

  set setConnectedUsers(value: string[]) {
    this.connectedUsers = value;
  }
import { Question } from '../question/entity/question.entity';
import { Answer } from '../question/entity/answer.entity';

export class Session {
  constructor(idSession: string, tabQuestions: Question[]) {
    this.id = idSession;
    this.questionNumber = 0;
    this.questionList = tabQuestions;
    this.connectedUser = new Set<string>();
    this.userAnswers = new Map<string, Map<Question, Answer>>();
  }
  id: string;

  questionList: Question[];

  questionNumber: number;

  connectedUser: Set<string>;

  userAnswers: Map<string, Map<Question, Answer>> = new Map<
    string,
    Map<Question, Answer>
  >();
}
