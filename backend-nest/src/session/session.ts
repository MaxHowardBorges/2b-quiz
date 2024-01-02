import { Question } from '../question/entity/question.entity';
import { Answer } from '../question/entity/answer.entity';
import { Teacher } from '../user/entity/teacher.entity';
import { Student } from '../user/entity/student.entity';
import { ParticipantInterface } from '../user/interface/participant.interface';

export class Session {
  id: string;

  questionList: Question[];

  questionNumber: number;

  connectedUser: Set<ParticipantInterface>;

  userAnswers: Map<number, Map<Question, Answer>>;

  endSession: boolean;

  host: Teacher;

  constructor(idSession: string, tabQuestions: Question[], host: Teacher) {
    this.id = idSession;
    this.questionNumber = -1;
    this.questionList = tabQuestions;
    this.connectedUser = new Set<ParticipantInterface>();
    this.userAnswers = new Map<number, Map<Question, Answer>>();
    this.endSession = false;
    this.host = host;
  }

  hasUser(user: Student | Teacher): boolean {
    return [...this.connectedUser].some((u) => u.equals(user));
  }
}
