import { Injectable } from '@nestjs/common';
import { MasterQuestion } from 'src/api/question/schema/master-question.schema';
import { QuestionDocument } from 'src/api/question/schema/question.schema';
import {
  ILabelTemplate,
  IMasterQuestionTemplate,
} from 'src/types/template-data.interface';
import { IQuestionUtil } from './question-util.interface';

@Injectable()
export class MultiQuestionUtil implements IQuestionUtil {
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
            $match: { 'responses.quesId': qId },
          },
          {
            $unwind: '$responses.value',
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
        $unwind: '$responses.value',
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
      .map((label) => ({
        labelText: label.label,
        labelCode: label.code,
        order: +label.order,
        variableId: label.subQuesId,
      }));

    const questionDocument = {
      qId: question.qId,
      questionText: question.qText,
      type: question.type,
      options,
    };
    return questionDocument;
  }

  generateSurveyResponseObject(question: MasterQuestion, surveyRow: object) {
    const values: string[] = [];

    for (let index = 0; index < question.options.length; index++) {
      const option = question.options[index];
      if (surveyRow[option.variableId] == '1') {
        values.push(option.labelCode);
      }
    }

    return {
      quesId: question.qId,
      value: values as string[],
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
          'responses.value': { $ne: [] },
        },
      },
      { $count: 'baseCount' },
    ];

    return query;
  }
}
