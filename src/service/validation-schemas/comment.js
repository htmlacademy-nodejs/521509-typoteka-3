'use strict';

/**
 * Схема для валидации комментария.
 *
 * Согласно ТЗ:
 * Текст комментария. Обязательно для заполнения. Минимум 20 символов.
 *
 * Также БД ограничен максимально возможная длина комментария в 1000 символов
 */

const Joi = require(`joi`);

const MIN_COMMENT_TEXT_SYMBOLS_COUNT = 20;
const MAX_COMMENT_TEXT_SYMBOLS_COUNT = 1000;

module.exports = Joi.object({
  text: Joi.string()
    .min(MIN_COMMENT_TEXT_SYMBOLS_COUNT)
    .max(MAX_COMMENT_TEXT_SYMBOLS_COUNT)
    .required()
    .messages({
      'string.base': `Текст комментария должен быть типом "String"`,
      'string.min': `Текст комментария не может быть меньше ${MIN_COMMENT_TEXT_SYMBOLS_COUNT} символов.`,
      'string.max': `Текст комментария не может быть больше ${MAX_COMMENT_TEXT_SYMBOLS_COUNT} символов.`,
      'any.required': `Текст комментария является обязательным полем.`
    })
});
