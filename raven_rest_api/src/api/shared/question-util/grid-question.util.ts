import { Injectable } from '@nestjs/common';
import { MasterQuestion } from 'src/api/question/schema/master-question.schema';
import { QuestionDocument } from 'src/api/question/schema/question.schema';
import { ISurveyResponse } from 'src/types/survey-response.interface';
import {
  ILabelTemplate,
  IMasterQuestionTemplate,
} from 'src/types/template-data.interface';
import { IQuestionUtil } from './question-util.interface';

@Injectable()
export class GridQuestionUtil implements IQuestionUtil {
  generateAggregation(qId: string) {
    return [
      {
        $unwind: '$responses',
      },
      // {
      //   $match: { 'responses.grpId': qId },
      // },
      {
        $match: {
          $and: [
            { 'responses.grpId': qId },
            { 'responses.value': { $ne: '' } },
          ],
        },
      },
      {
        $group: {
          _id: { quesId: '$responses.quesId', value: '$responses.value' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.quesId',
          options: { $push: { option: '$_id.value', count: '$count' } },
        },
      },
    ];
  }

  generateQuestionDocument(
    question: IMasterQuestionTemplate,
    labels: ILabelTemplate[],
  ) {
    const subGroups = labels
      .filter((label) => {
        return label.qId === question.qId;
      })
      .map((label) => ({
        qId: label.subQuesId,
        labelText: label.label,
        questionText: label.label,
        type: question.subType,
      }));

    const scale = labels
      .filter((label) => label.qId === question.gridId)
      .map((label) => ({
        labelText: label.label,
        labelCode: label.code,
        order: +label.order,
      }));
    const questionDocument = {
      qId: question.qId,
      questionText: question.qText,
      type: question.type,
      subGroups,
      scale,
    };
    return questionDocument;
  }

  generateSurveyResponseObject(question: MasterQuestion, surveyRow: object) {
    const responses: ISurveyResponse[] = [];

    for (let index = 0; index < question.subGroups.length; index++) {
      const subGroup = question.subGroups[index];
      responses.push({
        grpId: question.qId,
        quesId: subGroup.qId,
        value: surveyRow[subGroup.qId],
      });
    }
    return responses;
  }

  generateCountAggregation(question: QuestionDocument) {
    return [{ $count: 'baseCount' }];
  }
}
