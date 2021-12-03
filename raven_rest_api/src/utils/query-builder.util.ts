import { Aggregate } from 'mongoose';
import { PaginateQueryDto } from 'src/api/shared/dto/paginate-query.dto';

export class AggregationQueryBuilder {
  private aggregationPipeline: any[];

  constructor(
    private readonly query: PaginateQueryDto,
    private readonly execCallback: (pipeline: object[]) => Aggregate<any>,
  ) {
    this.aggregationPipeline = [];
  }

  sort() {
    // if (this.query.sortBy) {
    let { sortBy, sortOrder } = this.query;
    if (!sortBy) {
      sortBy = 'createdAt';
      sortOrder = 'desc';
    }
    const sortOrderFlag = sortOrder === 'desc' ? -1 : 1;
    this.aggregationPipeline.push({
      $sort: {
        [sortBy]: sortOrderFlag,
      },
    });
    // }
    return this;
  }

  paginate() {
    let { currentPage = 1, recordsPerPage = undefined } = this.query;
    const skip = recordsPerPage ? (currentPage - 1) * +recordsPerPage : 0;
    const limit = recordsPerPage !== undefined ? +recordsPerPage : undefined;
    this.aggregationPipeline.push({ $skip: skip });
    if (limit !== undefined) {
      this.aggregationPipeline.push({ $limit: limit });
    }
    return this;
  }

  aggregate(...aggregationQuery: object[]) {
    if (aggregationQuery) {
      aggregationQuery.forEach((queryObj) => {
        this.aggregationPipeline.push(queryObj);
      });
    }
    return this;
  }

  search(searchFields: string[]) {
    let { searchText } = this.query;
    if (searchText && searchFields.length) {
      const matchAggregation = {
        $or: searchFields.map((field) => ({
          [field]: { $regex: searchText, $options: 'i' },
        })),
      };
      this.aggregationPipeline.push({ $match: matchAggregation });
    }
    return this;
  }

  async exec() {
    let {
      currentPage = 1,
      recordsPerPage = undefined,
      sortBy = '',
      sortOrder = '',
    } = this.query;
    const aggregationResult = await this.execCallback([
      {
        $facet: {
          totalRecords: [{ $count: 'totalRecords' }],
          data: this.aggregationPipeline,
        },
      },
    ]);

    return {
      data: aggregationResult[0].data,
      totalRecords: aggregationResult[0]?.totalRecords[0]?.totalRecords || 0,
      currentPage: +currentPage,
      recordsPerPage:
        +recordsPerPage || aggregationResult[0]?.data?.length || 0,
      sortBy,
      sortOrder,
    };
  }
}
