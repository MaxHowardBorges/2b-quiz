import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { QuestionnaryDto } from '../../questionnary/dto/questionnary.dto';
import { UserAnswerDto } from './userAnswer.dto';
import { Type } from 'class-transformer';

export class QuestionnaryUsersAnswerMapDto {
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => QuestionnaryDto)
  questionnaries: QuestionnaryDto[];

  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => UserAnswerDto)
  usersAnswer: UserAnswerDto[];
}
