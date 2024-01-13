import { Injectable } from '@nestjs/common';
import { Questionnary } from '../entity/questionnary.entity';
import { QuestionnaryDto } from '../dto/questionnary.dto';
import { QuestionMapper } from '../../question/mapper/question.mapper';

@Injectable()
export class QuestionnaryMapper {
  constructor(private readonly questionMapper: QuestionMapper) {}

  entityToQuestionnaryDtoTab(
    questionnaries: Questionnary[],
  ): QuestionnaryDto[] {
    return questionnaries.map((questionnary) =>
      this.entityToQuestionnaryDto(questionnary),
    );
  }
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
}
