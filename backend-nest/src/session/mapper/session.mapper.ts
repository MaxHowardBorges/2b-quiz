import { AnswerMapper } from '../../question/mapper/answer.mapper';
import { Question } from '../../question/entity/question.entity';
import { CurrentQuestionDto } from '../dto/currentQuestion.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionMapper {
  constructor(private readonly answerMapper: AnswerMapper) {}

  mapCurrentQuestionDto(question: Question): CurrentQuestionDto {
    return {
      id: question.id,
      content: question.content,
      answers: this.answerMapper.mapAnswersStudentDtos(question.answers),
    };
  }
}
