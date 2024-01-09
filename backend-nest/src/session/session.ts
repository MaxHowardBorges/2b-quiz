import { Questionnary } from '../questionnary/entity/questionnary.entity';
import { Question } from '../question/entity/question.entity';
import { Answer } from '../question/entity/answer.entity';
import { AccessTypeEnum } from './enum/accessType.enum';

export class Session {
  id: string;

  questionnaryList: Questionnary[];

  questionnaryNumber: number;

  questionNumber: number;

  connectedUser: Set<string>;

  userAnswers: Map<string, Map<Question, Answer | string | Answer[]>>;

  endSession: boolean;

  accessType: AccessTypeEnum;

  whitelist: number[];

  open: boolean;

  constructor(idSession: string, tabQuestionnary: Questionnary[]) {
    this.id = idSession;
    this.questionNumber = -1;
    this.questionnaryNumber = 0;
    this.questionnaryList = tabQuestionnary;
    this.connectedUser = new Set<string>();
    this.userAnswers = new Map<string, Map<Question, Answer>>();
    this.endSession = false;
    this.open = true;
    this.accessType = AccessTypeEnum.Public;
    this.whitelist = [];
  }
}
