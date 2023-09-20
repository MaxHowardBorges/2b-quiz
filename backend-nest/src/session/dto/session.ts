// id, liste question, nomero question, string[] connecté

import { Question } from '../../question/entity/question.entity';

export class Session {
  id: string;

  private questionList: Question[];

  private questionNumber: number;

  private connectedUsers: string[];

  constructor(id: string, questionList: Question[]) {
    this.id = id;
    this.questionList = questionList;
    this.questionNumber = 0;
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
}
