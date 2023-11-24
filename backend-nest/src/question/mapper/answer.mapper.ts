import { AnswerStudentDto } from '../dto/answerStudent.dto';
import { Injectable } from '@nestjs/common';
import { AnswerDto } from '../dto/answer.dto';

@Injectable()
export class AnswerMapper {
  mapAnswersStudentDtos(answers: AnswerDto[]): AnswerStudentDto[] {
    return answers.map((answer) => this.mapAnswerStudentDto(answer));
  }
  mapAnswerStudentDto(answer: AnswerDto): AnswerStudentDto {
    return {
      content: answer.content,
      id: answer.id,
    };
  }
}
