import { AnswerMapper } from '../../question/mapper/answer.mapper';
import { CurrentQuestionDto } from '../dto/currentQuestion.dto';
import { Injectable } from '@nestjs/common';
import { UserAnswerDto } from '../dto/userAnswer.dto';
import { AnswerQuestionDto } from '../dto/answerQuestion.dto';
import { QuestionDto } from '../../question/dto/question.dto';
import { AnswerDto } from '../../question/dto/answer.dto';

@Injectable()
export class SessionMapper {
  constructor(private readonly answerMapper: AnswerMapper) {}

  mapCurrentQuestionDto(question: QuestionDto): CurrentQuestionDto {
    return {
      id: question.id,
      content: question.content,
      answers: this.answerMapper.mapAnswersStudentDtos(question.answers),
      type: question.type,
    };
  }

  mapUserAnswerDto(
    userAnswers: Map<
      string,
      Map<QuestionDto, AnswerDto | string | AnswerDto[]>
    >,
  ): UserAnswerDto[] {
    const userAnswerDtos = [];

    for (const [username, innerMap] of userAnswers.entries()) {
      const userAnswerDto = new UserAnswerDto();
      userAnswerDto.username = username;
      userAnswerDto.tab = [];

      for (const [question, answer] of innerMap.entries()) {
        const answerQuestion = new AnswerQuestionDto();

        if (Array.isArray(answer)) {
          answerQuestion.idAnswer = answer.map((answer) =>
            answer instanceof AnswerDto ? answer.id : answer,
          );
        } else {
          answerQuestion.idAnswer =
            answer instanceof AnswerDto ? answer.id : answer;
        }
        //answerQuestion.idAnswer = answer.id;
        answerQuestion.idQuestion = question.id;
        userAnswerDto.tab.push(answerQuestion);
      }
      userAnswerDtos.push(userAnswerDto);
    }

    return userAnswerDtos;
  }
}
