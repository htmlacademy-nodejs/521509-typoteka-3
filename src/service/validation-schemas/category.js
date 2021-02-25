'use strict';

/**
 * Схема для валидации категории.
 *
 * Согласно ТЗ:
 * Название новой категории. Обязательно для заполнения. Минимум 5 символов. Максимум 30.
 */

const Joi = require(`joi`);

const MIN_CATEGORY_NAME_SYMBOLS_COUNT = 5;
const MAX_CATEGORY_NAME_SYMBOLS_COUNT = 30;

module.exports = Joi.object({
  title: Joi.string()
    .min(MIN_CATEGORY_NAME_SYMBOLS_COUNT)
    .max(MAX_CATEGORY_NAME_SYMBOLS_COUNT)
    .required()
    .messages({
      'string.base': `Название категории должен быть типом "String"`,
      'string.min': `Название категории не может быть меньше ${MIN_CATEGORY_NAME_SYMBOLS_COUNT} символов.`,
      'string.max': `Название категории не может быть больше ${MAX_CATEGORY_NAME_SYMBOLS_COUNT} символов.`,
      'any.required': `Название категории является обязательным полем.`
    })
});
