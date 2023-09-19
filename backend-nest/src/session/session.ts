// id, liste question, nomero question, string[] connecté

import { Question } from '../question/entity/question.entity';

export class Session {
  constructor(idSession: string, tabQuestions: Question[]) {
    this.id = idSession;
    this.questionNumber = 0;
    this.questionList = tabQuestions;
  }
  id: string;

  questionList: Question[];

  questionNumber: number;

  connectedUser: string[];
}
