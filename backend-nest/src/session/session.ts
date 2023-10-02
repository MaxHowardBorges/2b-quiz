import { Question } from '../question/entity/question.entity';
import { Answer } from '../question/entity/answer.entity';

export class Session {
  id: string;

  questionList: Question[];

  questionNumber: number;

  connectedUser: Set<string>;

  userAnswers: Map<string, Map<Question, Answer>>;

  endSession: boolean;

  constructor(idSession: string, tabQuestions: Question[]) {
    this.id = idSession;
    this.questionNumber = -1;
    this.questionList = tabQuestions;
    this.connectedUser = new Set<string>();
    this.userAnswers = new Map<string, Map<Question, Answer>>();
    this.endSession = false;
  }
}
