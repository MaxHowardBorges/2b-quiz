import { Questionnary } from '../../questionnary/entity/questionnary.entity';
import { Question } from '../../question/entity/question.entity';
import { Answer } from '../../question/entity/answer.entity';
import { ParticipantInterface } from '../../user/interface/participant.interface';
import { Teacher } from '../../user/entity/teacher.entity';
import { SettingsObject } from '../object/settings.object';

export class SessionTemp {
  id: string;

  questionnary: Questionnary;

  questionnaryNumber: number;

  questionNumber: number;

  connectedUser: Set<ParticipantInterface>;

  userAnswers: Map<number, Map<Question, Answer | string | Answer[]>>;

  endSession: boolean;

  host: Teacher;

  settings: SettingsObject;

  whitelist: number[];

  whitelistGroups: number[];

  constructor(
    idSession: string,
    questionnary: Questionnary,
    host: Teacher,
    settings: SettingsObject,
  ) {
    this.id = idSession;
    this.questionNumber = -1;
    this.questionnaryNumber = 0;
    this.questionnary = questionnary;
    this.connectedUser = new Set<ParticipantInterface>();
    this.userAnswers = new Map<
      number,
      Map<Question, Answer | string | Answer[]>
    >();
    this.endSession = false;
    this.host = host;
    this.settings = settings;
    this.whitelist = [];
    this.whitelistGroups = [];
  }

  hasUser(user: ParticipantInterface): boolean {
    return [...this.connectedUser].some((u) => u.equals(user));
  }

  getCurrentQuestion(): Question {
    if (this.questionNumber === -1) return null;
    return this.questionnary.questions[this.questionNumber];
  }

  getNbAnsweredForCurrentQuestion(): number {
    let sum = 0;
    if (this.getCurrentQuestion() === null) return null;
    for (const user of this.connectedUser) {
      const questionMap = this.userAnswers.get(user.id);
      if (questionMap !== undefined)
        if (questionMap.has(this.getCurrentQuestion())) sum++;
    }
    // TODO: Not work see branch dev/pri-session-types
    return sum;
  }
}
