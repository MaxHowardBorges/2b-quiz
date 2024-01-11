import { Questionnary } from '../../questionnary/entity/questionnary.entity';
import { Question } from '../../question/entity/question.entity';
import { Answer } from '../../question/entity/answer.entity';

export class SessionTemp {
  id: string;

  questionnaryList: Questionnary[];

  questionnaryNumber: number;

  questionNumber: number;

  connectedUser: Set<string>;

  userAnswers: Map<string, Map<Question, Answer | string | Answer[]>>;

  endSession: boolean;

  constructor(idSession: string, tabQuestionnary: Questionnary[]) {
    this.id = idSession;
    this.questionNumber = -1;
    this.questionnaryNumber = 0;
    this.questionnaryList = tabQuestionnary;
    this.connectedUser = new Set<string>();
    this.userAnswers = new Map<string, Map<Question, Answer>>();
    this.endSession = false;
  }
}
