import { QuestionResultDto } from './questionResult.dto';

export class ResultsDto {
  constructor() {
    this.username = '';
    this.personnalResult = 0;
    this.questions = [];
  }
  username: string;

  personnalResult: number;

  questions: QuestionResultDto[];

  globalResult?: number;

  teacherSurname?: string;

  teacherUsername?: string;

  sessionDate?: Date;

  averagePerQuestion: { id: number; average: number }[];

  totalUsers: number;
}
