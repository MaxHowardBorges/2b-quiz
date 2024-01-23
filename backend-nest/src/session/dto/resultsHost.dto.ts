import { QuestionResultDto } from './questionResult.dto';
import { ResultsDto } from './results.dto';

export class ResultsHostDto {
  constructor() {
    this.globalResult = 0;
  }

  globalResult: number;

  teacherSurname: string;

  teacherUsername: string;

  sessionDate: Date;

  results: ResultsDto[];
}
