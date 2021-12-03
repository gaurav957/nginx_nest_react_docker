import * as Joi from 'joi';
import { responseErrors } from 'src/constant/message.constant';
import regex from 'src/constant/regex.constant';

export const createUserValidation = Joi.object({
  _id: Joi.string().allow(null, ''),
  firstName: Joi.string().required().messages({
    'any.required': responseErrors.FIRST_NAME_REQUIRED,
    'string.empty': responseErrors.FIRST_NAME_REQUIRED,
    'string.base': responseErrors.FIRST_NAME_REQUIRED,
  }),
  lastName: Joi.string().allow(''),
  email: Joi.string().required().pattern(regex.EMAIL_REGEX).messages({
    'any.required': responseErrors.EMAIL_REQUIRED,
    'string.empty': responseErrors.EMAIL_REQUIRED,
    'string.base': responseErrors.EMAIL_REQUIRED,
    'string.pattern.base': responseErrors.EMAIL_INVALID,
  }),
  isAdmin: Joi.boolean(),
});
