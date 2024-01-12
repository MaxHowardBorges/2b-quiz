import { Questionnary } from '../../questionnary/entity/questionnary.entity';
import { Question } from '../../question/entity/question.entity';
import { Answer } from '../../question/entity/answer.entity';
import { ParticipantInterface } from '../../user/interface/participant.interface';
import { Teacher } from '../../user/entity/teacher.entity';
import { Column } from 'typeorm';

export class SessionTemp {
  id: string;

  questionnaryList: Questionnary[];

  questionnaryNumber: number;

  questionNumber: number;

  connectedUser: Set<ParticipantInterface>;

  userAnswers: Map<number, Map<Question, Answer | string | Answer[]>>;

  endSession: boolean;

  isResult: boolean;

  isGlobal: boolean;

  isAvailableAfter: boolean;

  host: Teacher;

  constructor(
    idSession: string,
    tabQuestionnary: Questionnary[],
    isResult: boolean,
    isGlobal: boolean,
    isAvailableAfter: boolean,
    host: Teacher,
  ) {
    this.id = idSession;
    this.questionNumber = -1;
    this.questionnaryNumber = 0;
    this.questionnaryList = tabQuestionnary;
    this.connectedUser = new Set<ParticipantInterface>();
    this.isResult = isResult;
    this.isGlobal = isGlobal;
    this.isAvailableAfter = isAvailableAfter;
    this.userAnswers = new Map<
      number,
      Map<Question, Answer | string | Answer[]>
    >();
    this.endSession = false;
    this.host = host;
  }

  hasUser(user: ParticipantInterface): boolean {
    return [...this.connectedUser].some((u) => u.equals(user));
  }
}
