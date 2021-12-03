import { Injectable } from '@nestjs/common';
import { Aggregate, Document, Model } from 'mongoose';
import { AggregationQueryBuilder } from 'src/utils/query-builder.util';
import { PaginateQueryDto } from '../dto/paginate-query.dto';

@Injectable()
export class PaginateService {
  initPaginate(
    paginateQueryDto: PaginateQueryDto,
    model: Model<any & Document>,
  ) {
    return new AggregationQueryBuilder(
      paginateQueryDto,
      (pipeline: object[]): Aggregate<any> => {
        return model.aggregate(pipeline).collation({
          locale: 'en',
          strength: 1,
        });
      },
    );
  }
}
