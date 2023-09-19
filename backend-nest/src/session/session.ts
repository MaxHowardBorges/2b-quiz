// id, liste question, nomero question, string[] connecté

import { Question } from '../question/entity/question.entity';

export class Session {
  id: string;

  questionList: Question[];

  questionNumber: number;

  connectedUsers: string[];

  constructor(id) {
    this.id = id;
  }
}
