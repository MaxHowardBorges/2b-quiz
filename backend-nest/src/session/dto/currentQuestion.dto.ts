import { Question } from '../../question/entity/question.entity';
import { AnswerStudentDto } from '../../question/dto/answerStudent.dto';

export class CurrentQuestionDto {
  question: Question;
  answers: AnswerStudentDto[];
}
