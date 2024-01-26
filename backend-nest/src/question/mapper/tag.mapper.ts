import { Injectable } from '@nestjs/common';
import { Tag } from '../entity/tag.entity';
import { TagDto } from '../dto/tag.dto';

@Injectable()
export class TagMapper {
  entityToTagDtoTab(tags: Tag[]): TagDto[] {
    return tags.map((tag) => this.entityToTagDto(tag));
  }
  entityToTagDto(tag: Tag): TagDto {
    return {
      idTag: tag.idTag,
      description: tag.description,
      questionsName: !!tag.questions
        ? tag.questions
            .filter((question) => question.author !== null)
            .map((question) => question.content)
        : [],
    };
  }
}
