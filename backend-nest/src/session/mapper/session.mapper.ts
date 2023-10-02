import { AnswerMapper } from '../../question/mapper/answer.mapper';
import { Question } from '../../question/entity/question.entity';
import { CurrentQuestionDto } from '../dto/currentQuestion.dto';
import { Injectable } from '@nestjs/common';
import { Answer } from '../../question/entity/answer.entity';
import { UserAnswerDto } from '../dto/userAnswer.dto';
import { AnswerQuestionDto } from '../dto/answerQuestion.dto';

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

  mapUserAnswerDto(
    userAnswers: Map<string, Map<Question, Answer>>,
  ): UserAnswerDto[] {
    const userAnswerDtos = [];
    for (const [username, innerMap] of userAnswers.entries()) {
      const userAnswerDto = new UserAnswerDto();
      userAnswerDto.username = username;
      userAnswerDto.tab = [];

      for (const [question, answer] of innerMap.entries()) {
        const answerQuestion = new AnswerQuestionDto();
        answerQuestion.idAnswer = answer.id;
        answerQuestion.idQuestion = question.id;
        userAnswerDto.tab.push(answerQuestion);
      }
      userAnswerDtos.push(userAnswerDto);
    }

    return userAnswerDtos;
  }
}
