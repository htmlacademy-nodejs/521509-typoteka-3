'use strict';

/**
 * Схема для валидации входа пользователя.
 */

const Joi = require(`joi`);

const MAX_USER_EMAIL_SYMBOLS_COUNT = 254;

module.exports = Joi.object({
  email: Joi.string()
    .max(MAX_USER_EMAIL_SYMBOLS_COUNT)
    .email()
    .required()
    .messages({
      'string.base': `Email пользователя должен быть типом "String"`,
      'string.max': `Email  не может быть больше ${MAX_USER_EMAIL_SYMBOLS_COUNT} символов.`,
      'string.email': `Email должен быть реальным.`,
      'any.required': `Email является обязательным полем.`
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.base': `Пароль быть типом "String"`,
      'any.required': `Пароль является обязательным полем.`
    })
});
