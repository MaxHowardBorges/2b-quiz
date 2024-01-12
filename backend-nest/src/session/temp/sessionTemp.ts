import { Questionnary } from '../../questionnary/entity/questionnary.entity';
import { Question } from '../../question/entity/question.entity';
import { Answer } from '../../question/entity/answer.entity';

export class SessionTemp {
  id: string;

  questionnaryList: Questionnary[];

  questionnaryNumber: number;

  questionNumber: number;

  connectedUser: Set<ParticipantInterface>;

  userAnswers: Map<number, Map<Question, Answer | string | Answer[]>>;

  endSession: boolean;

  host: Teacher;

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
    this.host = host;
  }

  hasUser(user: ParticipantInterface): boolean {
    return [...this.connectedUser].some((u) => u.equals(user));
  }
}
