'use strict';

/**
 * Схема для валидации id.
 *
 * Проверка, что переданный id можно привести к положительному числу.
 */

const Joi = require(`joi`);

module.exports = Joi
  .number()
  .positive()
  .messages({
    'number.base': `Id невозможно привести к числу.`,
    'number.positive': `Id должно быть положительным числом.`
  });
