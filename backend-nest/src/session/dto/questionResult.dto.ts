import { QuestionType } from '../../question/constants/questionType.constant';

export class QuestionResultDto {
  content: string;
  id: number;
  type: QuestionType;
  hasAnsweredCorrectly: boolean;
  isCorrect: boolean;
}
