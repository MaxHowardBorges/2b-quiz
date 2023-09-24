import { AnswerStudentDto } from '../../question/dto/answerStudent.dto';

export class CurrentQuestionDto {
  id: number;
  content: string;
  answers: AnswerStudentDto[];
}
