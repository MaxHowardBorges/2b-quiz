import { Questionnary } from '../../questionnary/entity/questionnary.entity';
import { ParticipantInterface } from '../../user/interface/participant.interface';
import { Question } from '../../question/entity/question.entity';
import { Answer } from '../../question/entity/answer.entity';
import { Teacher } from '../../user/entity/teacher.entity';
import { QuestionnaryDto } from '../../questionnary/dto/questionnary.dto';

export class SessionDto {
  id: string;

  questionnary: QuestionnaryDto;

  questionnaryNumber: number;

  questionNumber: number;

  connectedUser: Set<ParticipantInterface>;

  userAnswers: Map<number, Map<Question, Answer | string | Answer[]>>;

  endSession: boolean;

  isResult: boolean;

  isGlobal: boolean;

  isResponses: boolean;

  host: Teacher;
}
