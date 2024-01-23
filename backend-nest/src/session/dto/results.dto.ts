import { QuestionResultDto } from './questionResult.dto';

export class ResultsDto {
  constructor() {
    this.username = '';
    this.personnalResult = 0;
    this.questions = [];
    this.globalResult = 0;
  }
  username: string;

  personnalResult: number;

  questions: QuestionResultDto[];

  globalResult: number;

  teacherSurname: string;

  sessionDate: Date;
}
