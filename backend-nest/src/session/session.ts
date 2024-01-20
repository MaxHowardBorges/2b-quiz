import { Questionnary } from '../questionnary/entity/questionnary.entity';
import { Question } from '../question/entity/question.entity';
import { Answer } from '../question/entity/answer.entity';
import { Teacher } from '../user/entity/teacher.entity';
import { ParticipantInterface } from '../user/interface/participant.interface';
import { SettingsObject } from './object/settings.object';

export class Session {
  id: string;

  questionnaryList: Questionnary[];

  questionnaryNumber: number;

  questionNumber: number;

  connectedUser: Set<ParticipantInterface>;

  userAnswers: Map<number, Map<Question, Answer | string | Answer[]>>;

  endSession: boolean;

  host: Teacher;

  whitelist: number[];

  whitelistGroups: number[];

  settings: SettingsObject;

  constructor(
    idSession: string,
    tabQuestionnary: Questionnary[],
    host: Teacher,
    settings: SettingsObject,
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
    this.whitelist = [];
    this.host = host;
    this.settings = settings;
    this.whitelistGroups = [];
  }

  hasUser(user: ParticipantInterface): boolean {
    return [...this.connectedUser].some((u) => u.equals(user));
  }

  getCurrentQuestion(): Question {
    if (this.questionNumber === -1) return null;
    return this.questionnaryList[this.questionnaryNumber].questions[
      this.questionNumber
    ];
  }

  getNbAnsweredForCurrentQuestion(): number {
    let sum = 0;
    if (this.getCurrentQuestion() === null) return null;
    for (const user of this.connectedUser) {
      const questionMap = this.userAnswers.get(user.id);
      if (questionMap !== undefined)
        if (questionMap.has(this.getCurrentQuestion())) sum++;
    }
    return sum;
  }
}
