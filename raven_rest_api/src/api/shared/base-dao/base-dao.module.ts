import { Module } from '@nestjs/common';
import { BaseDaoService } from './base-dao.service';
import { PaginateService } from './paginate.service';

@Module({
  providers: [BaseDaoService, PaginateService],
  exports: [BaseDaoService, PaginateService],
})
export class BaseDaoModule {}
