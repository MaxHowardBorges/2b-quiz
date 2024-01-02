import { Question } from '../question/entity/question.entity';
import { Answer } from '../question/entity/answer.entity';
import { Teacher } from '../user/entity/teacher.entity';
import { Student } from '../user/entity/student.entity';

export class Session {
  id: string;

  questionList: Question[];

  questionNumber: number;

  connectedUser: Set<Student | Teacher>;

  userAnswers: Map<Student | Teacher, Map<Question, Answer>>;

  endSession: boolean;

  host: Teacher;

  constructor(idSession: string, tabQuestions: Question[], host: Teacher) {
    this.id = idSession;
    this.questionNumber = -1;
    this.questionList = tabQuestions;
    this.connectedUser = new Set<Student | Teacher>();
    this.userAnswers = new Map<Student | Teacher, Map<Question, Answer>>();
    this.endSession = false;
    this.host = host;
  }
}
