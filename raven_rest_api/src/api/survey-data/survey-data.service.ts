import { Injectable } from '@nestjs/common';
import { CreateSurveyDatumDto } from './dto/create-survey-datum.dto';
import { UpdateSurveyDatumDto } from './dto/update-survey-datum.dto';
import * as path from 'path';
import { readCsv } from 'src/utils/csv-reader.util';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { QuestionType } from 'src/enums/question-type.enum';
import { Promise } from 'bluebird';
import { QuestionUtilGenerator } from '../shared/question-util/question.util';
import { MasterQuestionDocument } from '../question/schema/master-question.schema';

@Injectable()
export class SurveyDataService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly questionUtilGenerator: QuestionUtilGenerator,
  ) {}

  async create() {
    const baseFilePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '/public/assets',
    );

    const surveyDataFilePath = baseFilePath + '/raw-data-mini.csv';
    const [surveyData, questions] = await Promise.all([
      readCsv<object>(surveyDataFilePath),
      this.connection
        .model<MasterQuestionDocument>('MasterQuestion')
        .find({})
        .lean(),
    ]);

    const documents = [];
    for (let index = 0; index < surveyData.length; index++) {
      const row = surveyData[index];
      const document = {
        respId: row['respid'],
        responses: [],
      };

      for (let quesIndex = 0; quesIndex < questions.length; quesIndex++) {
        const question = questions[quesIndex];
        const questionUtil = this.questionUtilGenerator.init(question.type);
        const surveyResponse = questionUtil.generateSurveyResponseObject(
          question,
          row,
        );
        document.responses = Array.isArray(surveyResponse)
          ? [...document.responses, ...surveyResponse]
          : [...document.responses, surveyResponse];
      }
      documents.push(document);
    }
    await this.connection.model('SurveyData').deleteMany();
    await this.connection.model('SurveyData').insertMany(documents);
  }

  findAll() {
    return this.connection.model('SurveyData').aggregate([
      {
        $match: {
          $and: [{ 'responses.quesId': 'D1' }, { 'responses.value': '12' }],
        },
      },

      {
        $unwind: '$responses',
      },

      {
        $match: { 'responses.quesId': 'D2' },
      },

      {
        $group: { _id: '$responses.value', count: { $count: {} } },
      },
    ]);
  }
}
