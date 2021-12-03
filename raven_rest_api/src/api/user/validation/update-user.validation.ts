import * as Joi from 'joi';
import { responseErrors } from 'src/constant/message.constant';
import regex from 'src/constant/regex.constant';

export const updateUserValidation = Joi.object({
  _id: Joi.string().allow(null, ''),
  firstName: Joi.string().messages({
    'string.empty': responseErrors.FIRST_NAME_REQUIRED,
    'string.base': responseErrors.FIRST_NAME_REQUIRED,
  }),
  lastName: Joi.string().allow('').messages({
    'string.empty': responseErrors.LAST_NAME_REQUIRED,
    'string.base': responseErrors.LAST_NAME_REQUIRED,
  }),
  email: Joi.string().pattern(regex.EMAIL_REGEX).messages({
    'string.empty': responseErrors.EMAIL_REQUIRED,
    'string.base': responseErrors.EMAIL_REQUIRED,
    'string.pattern.base': responseErrors.EMAIL_INVALID,
  }),
  isAdmin: Joi.boolean(),
});
