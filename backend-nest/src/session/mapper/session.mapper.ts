import { AnswerMapper } from '../../question/mapper/answer.mapper';
import { CurrentQuestionDto } from '../dto/currentQuestion.dto';
import { Injectable } from '@nestjs/common';
import { UserAnswerDto } from '../dto/userAnswer.dto';
import { AnswerQuestionDto } from '../dto/answerQuestion.dto';
import { QuestionDto } from '../../question/dto/question.dto';
import { AnswerDto } from '../../question/dto/answer.dto';
import { ParticipantInterface } from '../../user/interface/participant.interface';
import { Session } from '../session';
import { SessionStatusDto } from '../dto/sessionStatus.dto';
import { QuestionnaryDto } from '../../questionnary/dto/questionnary.dto';
import { QuestionnaryUsersAnswerMapDto } from '../dto/QuestionnaryUsersAnswerMap.dto';
import { SessionDto } from '../dto/session.dto';
import { SessionTemp } from '../temp/sessionTemp';
import { QuestionnaryMapper } from '../../questionnary/mapper/questionnary.mapper';
import { Question } from '../../question/entity/question.entity';
import { QuestionResultDto } from '../dto/questionResult.dto';

@Injectable()
export class SessionMapper {
  constructor(
    private readonly answerMapper: AnswerMapper,
    private readonly questionnaryMapper: QuestionnaryMapper,
  ) {}

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
      ParticipantInterface,
      Map<QuestionDto, AnswerDto | string | AnswerDto[]>
    >,
  ): UserAnswerDto[] {
    const userAnswerDtos = [];
    for (const [user, innerMap] of userAnswers.entries()) {
      const userAnswerDto = new UserAnswerDto();
      userAnswerDto.username = user.username;
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

  mapQuestionnaryUsersAnswer(
    questionnaries: QuestionnaryDto[],
    usersAnswer: UserAnswerDto[],
  ): QuestionnaryUsersAnswerMapDto {
    return {
      questionnaries: questionnaries,
      usersAnswer: usersAnswer,
    };
  }

  mapSessionStatusDto(session: Session): SessionStatusDto {
    const sessionStatusDto = new SessionStatusDto();
    sessionStatusDto.nbJoined = session.connectedUser.size;
    sessionStatusDto.nbAnswered = session.getNbAnsweredForCurrentQuestion();
    sessionStatusDto.settings = session.settings;
    sessionStatusDto.displaySettings = session.settings.displaySettings;
    sessionStatusDto.whitelist = session.whitelist;
    return sessionStatusDto;
  }

  //map sessionTemp into a dto with the same arguments, shoud return a sessionTempDto
  mapSessionTempDto(sessionTemp: SessionTemp): SessionDto {
    const questionnaryDto = this.questionnaryMapper.entityToQuestionnaryDto(
      sessionTemp.questionnary,
    );
    return {
      id: sessionTemp.id,
      questionnary: questionnaryDto,
      questionnaryNumber: sessionTemp.questionnaryNumber,
      questionNumber: sessionTemp.questionNumber,
      connectedUser: sessionTemp.connectedUser,
      userAnswers: sessionTemp.userAnswers,
      endSession: sessionTemp.endSession,
      isResult: sessionTemp.isResult,
      isGlobal: sessionTemp.isGlobal,
      isResponses: sessionTemp.isResponses,
      host: sessionTemp.host,
    };
  }

  mapQuestionResult(question: Question): QuestionResultDto {
    return {
      id: question.id,
      content: question.content,
      type: question.type,
      answers: [],
      hasAnsweredCorrectly: false,
    };
  }
}
