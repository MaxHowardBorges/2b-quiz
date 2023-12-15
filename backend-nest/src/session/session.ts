import { QuestionnaryDto } from '../questionnary/dto/questionnary.dto';
import { AnswerDto } from '../question/dto/answer.dto';
import { QuestionDto } from '../question/dto/question.dto';

export class Session {
  id: string;

  questionnaryList: QuestionnaryDto[];

  questionnaryNumber : number;

  questionNumber: number;

  connectedUser: Set<string>;

  userAnswers: Map<string, Map<QuestionDto, AnswerDto>>;

  endSession: boolean;

  constructor(idSession: string, tabQuestionnary: QuestionnaryDto[]) {
    this.id = idSession;
    this.questionNumber = -1;
    this.questionnaryNumber = 0;
    this.questionnaryList = tabQuestionnary;
    this.connectedUser = new Set<string>();
    this.userAnswers = new Map<string, Map<QuestionDto, AnswerDto>>();
    this.endSession = false;
  }
}
