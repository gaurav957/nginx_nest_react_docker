import { Test, TestingModule } from '@nestjs/testing';
import { UploadDataToDatabaseController } from './upload-data-to-database.controller';
import { UploadDataToDatabaseService } from './upload-data-to-database.service';

describe('UploadDataToDatabaseController', () => {
  let controller: UploadDataToDatabaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadDataToDatabaseController],
      providers: [UploadDataToDatabaseService],
    }).compile();

    controller = module.get<UploadDataToDatabaseController>(UploadDataToDatabaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
