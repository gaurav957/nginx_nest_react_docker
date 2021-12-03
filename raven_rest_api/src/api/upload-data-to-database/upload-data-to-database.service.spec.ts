import { Test, TestingModule } from '@nestjs/testing';
import { UploadDataToDatabaseService } from './upload-data-to-database.service';

describe('UploadDataToDatabaseService', () => {
  let service: UploadDataToDatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadDataToDatabaseService],
    }).compile();

    service = module.get<UploadDataToDatabaseService>(UploadDataToDatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
