import * as Joi from 'joi';
import { responseErrors } from 'src/constant/message.constant';
import regex from 'src/constant/regex.constant';

export const changePasswordValidation = Joi.object({
  oldPassword: Joi.string().required().pattern(regex.PASSWORD_REGEX).messages({
    'any.required': responseErrors.OLD_PASSWORD_REQUIRED,
    'string.empty': responseErrors.OLD_PASSWORD_REQUIRED,
    'string.base': responseErrors.OLD_PASSWORD_REQUIRED,
    'string.pattern.base': responseErrors.OLD_PASSWORD_INVALID,
  }),

  newPassword: Joi.string().required().pattern(regex.PASSWORD_REGEX).messages({
    'any.required': responseErrors.NEW_PASSWORD_REQUIRED,
    'string.empty': responseErrors.NEW_PASSWORD_REQUIRED,
    'string.base': responseErrors.NEW_PASSWORD_REQUIRED,
    'string.pattern.base': responseErrors.NEW_PASSWORD_INVALID,
  }),
});
