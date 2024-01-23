import { AnswerStudentDto } from '../dto/answerStudent.dto';
import { Injectable } from '@nestjs/common';
import { AnswerDto } from '../dto/answer.dto';
import { Answer } from '../entity/answer.entity';

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

  entityToAnswerDtoTab(answers: Answer[]): AnswerDto[] {
    return answers.map((answer) => this.entityToAnswerDto(answer));
  }
  entityToAnswerDto(answer: Answer): AnswerDto {
    return {
      id: answer.id,
      content: answer.content,
      isCorrect: answer.isCorrect,
    };
  }
}
