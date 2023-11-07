import { Test, TestingModule } from '@nestjs/testing';
import { QuestionnaryService } from './questionnary.service';

describe('QuestionnaryService', () => {
  let service: QuestionnaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionnaryService],
    }).compile();

    service = module.get<QuestionnaryService>(QuestionnaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
