import { Questionnary } from '../questionnary/entity/questionnary.entity';
import { Question } from '../question/entity/question.entity';
import { Answer } from '../question/entity/answer.entity';
import { Teacher } from '../user/entity/teacher.entity';
import { ParticipantInterface } from '../user/interface/participant.interface';
import { SettingsObject } from './object/settings.object';
import { DisplaySettingsObject } from './object/displaySettings.object';

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

  displaySettings: DisplaySettingsObject;

  settings: SettingsObject;

  constructor(
    idSession: string,
    tabQuestionnary: Questionnary[],
    host: Teacher,
    settings: SettingsObject,
    displaySettings: DisplaySettingsObject,
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
    this.displaySettings = displaySettings;
  }

  hasUser(user: ParticipantInterface): boolean {
    return [...this.connectedUser].some((u) => u.equals(user));
  }
}
