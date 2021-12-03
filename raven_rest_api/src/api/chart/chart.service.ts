import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { QuestionType } from 'src/enums/question-type.enum';
import { QuestionUtilGenerator } from '../shared/question-util/question.util';
import { CreateChartDto } from './dto/create-chart.dto';
import { Promise } from 'bluebird';
const PptxGenJS = require('pptxgenjs');
@Injectable()
export class ChartService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly questionUtilGenerator: QuestionUtilGenerator,
  ) {}

  async generateChart(createChartDto: CreateChartDto) {
    const questionUtil = this.questionUtilGenerator.init(createChartDto.type);

    const filterAggregation = [];
    if (createChartDto?.filters?.length) {
      filterAggregation.push({
        $match: {
          $and: createChartDto.filters.map((filterObj) => ({
            responses: {
              $elemMatch: {
                quesId: filterObj.qId,
                value: { $in: filterObj.value },
              },
            },
          })),
        },
      });
    }

    const question = await this.connection.model('Question').aggregate([
      {
        $match: { qId: createChartDto.qId },
      },
      {
        $lookup: {
          from: 'masterquestions',
          localField: 'qId',
          foreignField: 'qId',
          as: 'question',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ['$question', 0] }, '$$ROOT'],
          },
        },
      },
      { $unset: ['__v', 'question'] },
    ]);

    let bannerQuestion = null;

    if (createChartDto.bannerQuestion) {
      bannerQuestion = await this.connection.model('BannerQuestion').aggregate([
        {
          $match: { qId: createChartDto.bannerQuestion },
        },
        {
          $lookup: {
            from: 'masterquestions',
            localField: 'qId',
            foreignField: 'qId',
            as: 'question',
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [{ $arrayElemAt: ['$question', 0] }, '$$ROOT'],
            },
          },
        },
        { $unset: ['__v', 'question'] },
      ]);
    }

    const aggregationQuery = questionUtil.generateAggregation(
      createChartDto.qId,
      createChartDto.bannerQuestion,
      question[0],
    );

    const [chartData, baseCount] = await Promise.all([
      this.connection
        .model('SurveyData')
        .aggregate([...filterAggregation, ...aggregationQuery]),
      this.connection
        .model('SurveyData')
        .aggregate([
          ...filterAggregation,
          ...questionUtil.generateCountAggregation(question[0]),
        ]),
      // .count('baseCount'),
    ]);

    return {
      questionData: question[0],
      bannerQuestionData: bannerQuestion?.length > 0 ? bannerQuestion[0] : null,
      chartData,
      baseCount,
    };
  }
}
