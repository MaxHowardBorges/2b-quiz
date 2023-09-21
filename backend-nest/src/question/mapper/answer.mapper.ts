import { Answer } from '../entity/answer.entity';
import { AnswerStudentDto } from '../dto/answerStudent.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AnswerMapper {
  mapAnswersStudentDtos(answers: Answer[]): AnswerStudentDto[] {
    return answers.map((answer) => this.mapAnswerStudentDto(answer));
  }
  mapAnswerStudentDto(answer: Answer): AnswerStudentDto {
    return {
      content: answer.content,
      id: answer.id,
    };
  }
}
