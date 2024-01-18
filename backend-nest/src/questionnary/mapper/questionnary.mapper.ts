import { Injectable } from '@nestjs/common';
import { Questionnary } from '../entity/questionnary.entity';
import { QuestionnaryNbQuestionDto } from '../dto/questionnaryNbQuestion.dto';

@Injectable()
export class QuestionnaryMapper {
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
