import * as Joi from 'joi';
import { responseErrors } from 'src/constant/message.constant';

export const showContentPageValidation = Joi.object({
  showContentPageCheck: Joi.boolean().required().messages({
    'any.required': responseErrors.CONTENT_PAGE_CHECK_REQUIRED,
    'boolean.empty': responseErrors.CONTENT_PAGE_CHECK_REQUIRED,
    'boolean.base': responseErrors.CONTENT_PAGE_CHECK_REQUIRED,
  }),
});
