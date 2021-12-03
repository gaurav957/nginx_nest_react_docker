import { Controller, Get, Inject, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';
import { LoggerController } from './logger/logger.controller';
import { LoggerService } from './logger/logger.service';

import { custom, ObjectSchema } from 'joi';
import * as Joi from 'joi';
@Controller('/v1')
@ApiTags('Health Check')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logService: LoggerService,
  ) {}

  @Get('/helloworld')
  getHello(@Req() req: object): string {
    // this.logService.logInfo('Info log');
    // this.logService.logError('Error log', 0, req);
    // this.logService.logWarn('Warning log', 1, req);

    // const qDocument = {
    //   qId: 'Q99',
    //   questionText: '',
    //   type: '',
    //   options: {
    //     labelText: '',
    //     labelCode: '',
    //     order: '',
    //   },
    // };
    // let singleSchema: ObjectSchema = Joi.object({
    //   qId: Joi.string()
    //     .required()
    //     .messages({ 'any.required': 'qid is required' }),
    //   questionText: Joi.string()
    //     .required()
    //     .custom((value, helper) => {
    //       if (value == 'amogh') {
    //         return helper.message({ custom: 'custom validation works' });
    //       }
    //       return value;
    //     })
    //     .messages({ 'any.required': 'questionText is required' }),
    //   type: Joi.string()
    //     .required()
    //     .messages({ 'any.required': 'type is required' }),
    //   options: Joi.object().keys({
    //     labelText: Joi.string().required().messages({
    //       'any.requried': 'label text is required',
    //     }),
    //     labelCode: Joi.string().required().messages({
    //       'any.requried': 'labelCode text is required',
    //     }),
    //     order: Joi.string().required().messages({
    //       'any.requried': 'order text is required',
    //     }),
    //   }),
    // });
    // const { error } = singleSchema.validate(qDocument, { abortEarly: false });
    // if (error) {
    //   const message = 'QId:' + qDocument.qId + '|' + error.message || 'Invalid';
    //   console.log('result: ', message);
    // }

    return this.appService.getHello();
  }
}
