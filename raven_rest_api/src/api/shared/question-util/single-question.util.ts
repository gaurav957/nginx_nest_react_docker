import { Injectable } from '@nestjs/common';
import { LeanDocument } from 'mongoose';
import { MasterQuestion } from 'src/api/question/schema/master-question.schema';
import { QuestionDocument } from 'src/api/question/schema/question.schema';
import {
  ILabelTemplate,
  IMasterQuestionTemplate,
} from 'src/types/template-data.interface';
import { IQuestionUtil } from './question-util.interface';

@Injectable()
export class SingleQuestionUtil implements IQuestionUtil {
  generateAggregation(qId: string, bannerQuestion?: string, question?: any) {
    if (bannerQuestion) {
      const facetAggregation = {};
      for (let index = 0; index < question.options.length; index++) {
        const option = question.options[index];
        facetAggregation[option.labelCode] = [
          {
            $match: {
              $and: [
                {
                  responses: {
                    $elemMatch: {
                      quesId: question?.qId,
                      value: option.labelCode,
                    },
                  },
                },
              ],
            },
          },
          {
            $unwind: '$responses',
          },
          {
            $match: { 'responses.quesId': bannerQuestion },
          },
          {
            $group: { _id: '$responses.value', count: { $sum: 1 } },
          },
          {
            $project: {
              labelCode: '$_id',
              count: '$count',
              _id: 0,
            },
          },
        ];
      }
      return [
        {
          $facet: facetAggregation,
        },
      ];
    }

    return [
      {
        $unwind: '$responses',
      },

      {
        $match: { 'responses.quesId': qId },
      },

      {
        $group: { _id: '$responses.value', count: { $sum: 1 } },
      },
      {
        $project: {
          labelCode: '$_id',
          count: '$count',
          _id: 0,
        },
      },
    ];
  }

  generateQuestionDocument(
    question: IMasterQuestionTemplate,
    labels: ILabelTemplate[],
  ) {
    const options = labels
      .filter((label) => label.qId === question.qId)
      .map((label) => {
        return {
          labelText: label.label,
          labelCode: label.code,
          order: +label.order,
        };
      });

    const questionDocument = {
      qId: question['qId'],
      questionText: question.qText,
      type: question.type,
      options,
    };
    return questionDocument;
  }

  generateSurveyResponseObject(question: MasterQuestion, surveyRow: object) {
    return {
      quesId: question.qId,
      value: surveyRow[question.qId] as string,
    };
  }

  generateCountAggregation(question: QuestionDocument) {
    const query = [
      {
        $unwind: '$responses',
      },
      {
        $match: {
          'responses.quesId': question.qId,
          'responses.value': { $ne: '' },
        },
      },
      { $count: 'baseCount' },
    ];

    return query;
  }
}
