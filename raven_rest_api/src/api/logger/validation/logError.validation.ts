import * as Joi from 'joi';
import { logMessages, responseErrors } from 'src/constant/message.constant';
import regex from 'src/constant/regex.constant';

export const LogErrorValidation = Joi.object({
  message: Joi.string().required().messages({
    'any.required': logMessages.LOG_MESSAGE_REQUIRED,
    'string.empty': logMessages.LOG_MESSAGE_REQUIRED,
    'string.base': logMessages.LOG_MESSAGE_REQUIRED,
  }),

  origin: Joi.number(),

  req: Joi.object(),
});
