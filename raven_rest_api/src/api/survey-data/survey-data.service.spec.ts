import { Test, TestingModule } from '@nestjs/testing';
import { SurveyDataService } from './survey-data.service';

describe('SurveyDataService', () => {
  let service: SurveyDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SurveyDataService],
    }).compile();

    service = module.get<SurveyDataService>(SurveyDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
