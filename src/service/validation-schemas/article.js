'use strict';

/**
 * Схема для валидации статьи.
 *
 * Согласно ТЗ:
 *  Заголовок. Обязательное поле. Минимум 30 символов. Максимум 250;
 *  Фотография. Необязательное поле. Позволяет загружать изображения в формате jpg и png; (тут после мультера, проверять нужно там, тут доп проверка)
 *  Дата публикации (дата и время). Обязательное поле. По умолчанию текущая дата;
 *  Категории. Обязательно для выбора одна категория;
 *  Анонс публикации. Обязательное поле. Минимум 30 символов. Максимум 250;
 *  Полный текст публикации. Необязательное поле. Максимум 1000 символов.
 */

const Joi = require(`joi`);

const MIN_ARTICLE_TITLE_SYMBOLS_COUNT = 30;
const MAX_ARTICLE_TITLE_SYMBOLS_COUNT = 250;
const MIN_ARTICLE_ANNOUNCE_SYMBOLS_COUNT = 30;
const MAX_ARTICLE_ANNOUNCE_SYMBOLS_COUNT = 250;
const MAX_ARTICLE_TEXT_SYMBOLS_COUNT = 1000;

module.exports = Joi.object({
  title: Joi.string()
    .min(MIN_ARTICLE_TITLE_SYMBOLS_COUNT)
    .max(MAX_ARTICLE_TITLE_SYMBOLS_COUNT)
    .required()
    .messages({
      'string.base': `Название статьи должен быть типом "String"`,
      'string.min': `Название статьи не может быть меньше ${MIN_ARTICLE_TITLE_SYMBOLS_COUNT} символов.`,
      'string.max': `Название статьи не может быть больше ${MAX_ARTICLE_TITLE_SYMBOLS_COUNT} символов.`,
      'any.required': `Название статьи является обязательным полем.`
    }),
  announce: Joi.string()
    .min(MIN_ARTICLE_ANNOUNCE_SYMBOLS_COUNT)
    .max(MAX_ARTICLE_ANNOUNCE_SYMBOLS_COUNT)
    .required()
    .messages({
      'string.base': `Анонс статьи должен быть типом "String"`,
      'string.min': `Анонс статьи не может быть меньше ${MIN_ARTICLE_ANNOUNCE_SYMBOLS_COUNT} символов.`,
      'string.max': `Анонс статьи не может быть больше ${MAX_ARTICLE_ANNOUNCE_SYMBOLS_COUNT} символов.`,
      'any.required': `Анонс статьи является обязательным полем.`
    }),
  publishedAt: Joi.date()
    .iso()
    .required()
    .messages({
      'date.format': `Дата публикации в неверном формате`,
      'any.required': `Дата публикации является обязательным полем.`
    }),
  image: Joi.string()
    .regex(new RegExp(/\.(jpe?g|png)$/i))
    .optional()
    .messages({
      'string.base': `Название файла картинки должен быть типом "String"`,
      'any.regex': `Файл картинки должен быть в формате jpg или png.`
    }),
  categories: Joi.array()
    .items(Joi.number().positive().message(`Id категории должны быть положительными числами.`))
    .required()
    .messages({
      'array.base': `Список категорий должен быть типом массив.`,
      'any.required': `Список категорий является обязательным полем.`
    }),
  text: Joi.string()
    .max(MAX_ARTICLE_TEXT_SYMBOLS_COUNT)
    .optional()
    .messages({
      'string.base': `Название статьи должен быть типом "String"`,
      'string.max': `Название статьи не может быть больше ${MAX_ARTICLE_TEXT_SYMBOLS_COUNT} символов.`,
    })
});
