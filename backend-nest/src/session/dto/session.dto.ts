// id, liste question, nomero question, string[] connecté

import { Question } from '../../question/entity/question.entity';

export class SessionDto {
  id: string;

  private questionList: Question[];

  questionNumber: number;

  connectedUsers: string[];

  constructor(id, questionList) {
    this.id = id;
    this.questionList = questionList;
  }
}
