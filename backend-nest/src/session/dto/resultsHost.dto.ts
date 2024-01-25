import { ResultsDto } from './results.dto';
import { QuestionDto } from '../../question/dto/question.dto';

export class ResultsHostDto {
  constructor() {
    this.globalResult = 0;
    this.usersResults = [];
  }

  globalResult: number;

  teacherSurname: string;

  teacherUsername: string;

  sessionDate: Date;

  usersResults: ResultsDto[];

  questions: QuestionDto[];

  averagePerQuestion: { id: number; average: number }[];
}
