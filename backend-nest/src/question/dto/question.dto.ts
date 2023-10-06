import { AnswerDto } from './answer.dto';

export class QuestionDto {
  id: number;
  content: string;

  answers: AnswerDto[];
}
