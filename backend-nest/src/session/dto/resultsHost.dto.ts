import { ResultsDto } from './results.dto';

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
}
