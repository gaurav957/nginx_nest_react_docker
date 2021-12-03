import { Injectable } from '@nestjs/common';
import { Document, Model } from 'mongoose';
import { PaginateQueryDto } from '../dto/paginate-query.dto';

@Injectable()
export class BaseDaoService {
  async findWithPagination(
    model: Model<any & Document>,
    paginateQuery: PaginateQueryDto,
    aggregationQuery?: any,
    projection?: any,
    searchFields?: string[],
  ) {
    debugger;
    let {
      currentPage = 1,
      recordsPerPage = undefined,
      sortBy = '',
      sortOrder = '',
      searchText = '',
    } = paginateQuery;

    const skip = recordsPerPage ? (currentPage - 1) * +recordsPerPage : 0;
    const limit = recordsPerPage !== undefined ? +recordsPerPage : undefined;

    const paginateData: any[] = [{ $skip: skip }];
    if (limit) {
      paginateData.push({ $limit: limit });
    }
    if (sortBy) {
      const sortOrderFlag = sortOrder === 'desc' ? -1 : 1;
      paginateData.push({ $sort: { [sortBy]: sortOrderFlag } });
    }
    paginateData.push(
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy',
        },
      },
      {
        $set: {
          createdBy: { $arrayElemAt: ['$createdBy.name', 0] },
        },
      },
    );
    const matchAggregation = searchFields?.length
      ? {
          $or: searchFields.map((field) => ({
            [field]: { $regex: searchText, $options: 'i' },
          })),
        }
      : {};

    let paginateAggregation: any[] = [
      {
        $match: matchAggregation,
      },

      {
        $facet: {
          totalRecords: [{ $count: 'totalRecords' }],
          data: paginateData,
        },
      },
    ];
    let projection_ = {
      __v: false,
    };
    if (projection) {
      projection_ = { ...projection_, ...projection };
    }
    paginateAggregation.unshift({ $project: projection_ });
    // debugger;
    if (aggregationQuery) {
      paginateAggregation = [...aggregationQuery, ...paginateAggregation];
    }

    const paginateResult = await model
      .aggregate(paginateAggregation)
      .collation({
        locale: 'en',
        strength: 1,
      });

    return {
      data: paginateResult[0].data,
      totalRecords: paginateResult[0]?.totalRecords[0]?.totalRecords || 0,
      currentPage: +currentPage,
      recordsPerPage: +recordsPerPage || paginateResult[0]?.data?.length || 0,
      sortBy,
      sortOrder,
    };
  }

  // async initPaginate(
  //   paginateQueryDto: PaginateQueryDto,
  //   model: Model<any & Document>,
  // ) {
  //   return new AggregationQueryBuilder(paginateQueryDto, async (pipeline) => {
  //     await model.aggregate(pipeline);
  //   });
  // }
}
