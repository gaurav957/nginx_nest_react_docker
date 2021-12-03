import { Injectable } from '@nestjs/common';
import { UpdateQuestionDto } from './dto/update-question.dto';
import * as path from 'path';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { readCsv } from 'src/utils/csv-reader.util';
import { Promise } from 'bluebird';
import { QuestionUtilGenerator } from '../shared/question-util/question.util';
import {
  IBannerTemplate,
  ILabelTemplate,
  IMasterQuestionTemplate,
  IQuestionTemplate,
} from 'src/types/template-data.interface';
import { Connection, Document, Model } from 'mongoose';
import { Question, QuestionDocument } from './schema/question.schema';
import {
  MasterQuestion,
  MasterQuestionDocument,
} from './schema/master-question.schema';
import {
  BannerQuestion,
  BannerQuestionDocument,
} from './schema/banner-question.schema';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(MasterQuestion.name)
    private readonly masterQuestionModel: Model<MasterQuestionDocument>,
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
    @InjectModel(BannerQuestion.name)
    private readonly bannerQuestionModel: Model<BannerQuestionDocument>,
    private readonly questionUtilGenerator: QuestionUtilGenerator,
  ) {}

  async bulkInsertMasterQuestions() {
    const baseFilePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '/public/assets',
    );
    const questionFilePath = baseFilePath + '/masterQuestionTemplate.csv';
    const labelFilePath = baseFilePath + '/labelTemplate.csv';

    const [questions, labels] = await Promise.all([
      readCsv<IMasterQuestionTemplate>(questionFilePath),
      readCsv<ILabelTemplate>(labelFilePath),
    ]);

    const documents = [];

    for (let quesIndex = 0; quesIndex < questions.length; quesIndex++) {
      const question = questions[quesIndex];
      const questionUtil = this.questionUtilGenerator.init(question.type);
      const document = questionUtil.generateQuestionDocument(question, labels);
      if (document !== null) {
        documents.push(document);
      }
    }
    await this.masterQuestionModel.deleteMany();
    await this.masterQuestionModel.insertMany(documents);
  }

  async bulkInsertQuestions() {
    const baseFilePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '/public/assets',
    );
    const questionFilePath = baseFilePath + '/questionTemplate.csv';
    const questions = await readCsv<IQuestionTemplate>(questionFilePath);
    const documents = [];

    for (let quesIndex = 0; quesIndex < questions.length; quesIndex++) {
      const question = questions[quesIndex];
      documents.push({
        qId: question.qId,
        order: +question.order,
        chartType: question.chartTypes
          ?.split('|')
          ?.map((chartType) => +chartType),
        netAllowed: Boolean(+question.netAllowed),
        split: Boolean(+question.split),
        active: Boolean(+question.active),
        labelText: question.qLabelText,
      });
    }
    await this.questionModel.deleteMany();
    await this.questionModel.insertMany(documents);
  }

  async bulkInsertBannerQuestions() {
    const baseFilePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '/public/assets',
    );
    const questionFilePath = baseFilePath + '/bannerTemplate.csv';
    const questions = await readCsv<IBannerTemplate>(questionFilePath);
    const documents = [];

    for (let quesIndex = 0; quesIndex < questions.length; quesIndex++) {
      const question = questions[quesIndex];

      documents.push({
        qId: question.qId,
        labelText: question.qLabelText,
        order: +question.order,
        active: Boolean(+question.active),
      });
    }
    await this.bannerQuestionModel.deleteMany();
    await this.bannerQuestionModel.insertMany(documents);
  }

  findAllMasterQuestions() {
    return this.masterQuestionModel.find();
  }

  findAllQuestions() {
    return this.questionModel.aggregate([
      {
        $match: { active: true },
      },
      {
        $lookup: {
          from: this.masterQuestionModel.collection.name,
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

  findAllBannerQuestions() {
    return this.bannerQuestionModel.aggregate([
      {
        $match: { active: true },
      },
      {
        $lookup: {
          from: this.masterQuestionModel.collection.name,
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
}
