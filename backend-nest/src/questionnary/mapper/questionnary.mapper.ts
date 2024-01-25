import { Injectable } from '@nestjs/common';
import { Questionnary } from '../entity/questionnary.entity';

import { QuestionnaryDto } from '../dto/questionnary.dto';
import { QuestionMapper } from '../../question/mapper/question.mapper';
import { QuestionnaryNbQuestionDto } from '../dto/questionnaryNbQuestion.dto';

@Injectable()
export class QuestionnaryMapper {
  constructor(private readonly questionMapper: QuestionMapper) {}

  entityToQuestionnaryDto(questionnary: Questionnary): QuestionnaryDto {
    return {
      id: questionnary.id,
      title: questionnary.title,
      questions:
        questionnary.questions !== undefined
          ? this.questionMapper.entityToQuestionDtoTab(questionnary.questions)
          : null,
    };
  }
  mapQuestionnaryNbQuestionDto(
    questionnary: Questionnary,
  ): QuestionnaryNbQuestionDto {
    return {
      id: questionnary.id,
      title: questionnary.title,
      nbQuestion: questionnary.questions.length,
    };
  }
}
