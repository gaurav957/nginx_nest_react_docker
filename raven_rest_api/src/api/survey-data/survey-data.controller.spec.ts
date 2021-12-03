import { Test, TestingModule } from '@nestjs/testing';
import { SurveyDataController } from './survey-data.controller';
import { SurveyDataService } from './survey-data.service';

describe('SurveyDataController', () => {
  let controller: SurveyDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyDataController],
      providers: [SurveyDataService],
    }).compile();

    controller = module.get<SurveyDataController>(SurveyDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
