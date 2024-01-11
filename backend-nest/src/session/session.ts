import { Questionnary } from '../questionnary/entity/questionnary.entity';
import { Question } from '../question/entity/question.entity';
import { Answer } from '../question/entity/answer.entity';
import { Teacher } from '../user/entity/teacher.entity';
import { ParticipantInterface } from '../user/interface/participant.interface';
import { AccessTypeEnum } from './enum/accessType.enum';

export class Session {
  id: string;

  questionnaryList: Questionnary[];

  questionnaryNumber: number;

  questionNumber: number;

  connectedUser: Set<ParticipantInterface>;

  userAnswers: Map<number, Map<Question, Answer | string | Answer[]>>;

  endSession: boolean;

  host: Teacher;

  accessType: AccessTypeEnum;

  whitelist: number[];

  constructor(
    idSession: string,
    tabQuestionnary: Questionnary[],
    host: Teacher,
  ) {
    this.id = idSession;
    this.questionNumber = -1;
    this.questionnaryNumber = 0;
    this.questionnaryList = tabQuestionnary;
    this.connectedUser = new Set<ParticipantInterface>();
    this.userAnswers = new Map<
      number,
      Map<Question, Answer | string | Answer[]>
    >();
    this.endSession = false;
    this.accessType = AccessTypeEnum.Public;
    this.whitelist = [];
    this.host = host;
  }

  hasUser(user: ParticipantInterface): boolean {
    return [...this.connectedUser].some((u) => u.equals(user));
  }
}
