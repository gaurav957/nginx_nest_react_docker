import * as Joi from 'joi';
import { responseErrors } from 'src/constant/message.constant';
import regex from 'src/constant/regex.constant';

export const resetPasswordValidation = Joi.object({
  email: Joi.string().required().pattern(regex.EMAIL_REGEX).messages({
    'any.required': responseErrors.EMAIL_REQUIRED,
    'string.empty': responseErrors.EMAIL_REQUIRED,
    'string.base': responseErrors.EMAIL_REQUIRED,
    'string.pattern.base': responseErrors.EMAIL_INVALID,
  }),
  password: Joi.string().required().pattern(regex.PASSWORD_REGEX).messages({
    'any.required': responseErrors.PASSWORD_REQUIRED,
    'string.empty': responseErrors.PASSWORD_REQUIRED,
    'string.base': responseErrors.PASSWORD_REQUIRED,
    'string.pattern.base': responseErrors.PASSWORD_INVALID,
  }),

  token: Joi.string().required().messages({
    'any.required': responseErrors.TOKEN_REQUIRED,
    'string.empty': responseErrors.TOKEN_REQUIRED,
    'string.base': responseErrors.TOKEN_REQUIRED,
  }),
});
