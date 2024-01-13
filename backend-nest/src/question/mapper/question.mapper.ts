import { Injectable } from '@nestjs/common';
import { Question } from '../entity/question.entity';
import { QuestionDto } from '../dto/question.dto';
import { AnswerMapper } from './answer.mapper';
import { TagMapper } from './tag.mapper';

@Injectable()
export class QuestionMapper {
  constructor(
    private readonly answerMapper: AnswerMapper,
    private readonly tagMapper: TagMapper,
  ) {}

  entityToQuestionDtoTab(questions: Question[]): QuestionDto[] {
    return questions.map((question) => this.entityToQuestionDto(question));
  }
  entityToQuestionDto(question: Question): QuestionDto {
    return {
      id: question.id,
      content: question.content,
      type: question.type,
      tags:
        question.tags !== undefined
          ? this.tagMapper.entityToTagDtoTab(question.tags)
          : null,
      answers:
        question.answers !== undefined
          ? this.answerMapper.entityToAnswerDtoTab(question.answers)
          : null,
      originalId:
        question.originalId !== undefined ? question.originalId : null,
    };
  }
}
