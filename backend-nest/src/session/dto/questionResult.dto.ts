import { QuestionType } from '../../question/constants/questionType.constant';

export class QuestionResultDto {
  content: string;
  id: number;
  type: QuestionType;
  hasAnsweredCorrectly: boolean;
  correctAnswers: string[];
  studentAnswers: string[];
}
