'use strict';

/**
 * Схема для валидации нового.
 *
 * Согласно ТЗ:
 * Имя. Не должно содержать цифр и специальных символов;
 * Фамилия. Не должна содержать цифр и специальных символов;
 * Электронная почта. Уникальное значение (в базе не может быть двух пользователей с одинаковым email). Валидный адрес электронной почты;
 * Пароль. Не меньше 6 символов;
 * Повтор пароля. Не меньше 6 символов. Совпадает со значением поля «Пароль».
 */

const Joi = require(`joi`);

const MAX_USER_FIRST_NAME_SYMBOLS_COUNT = 35;
const MAX_USER_LAST_NAME_SYMBOLS_COUNT = 35;
const MAX_USER_EMAIL_SYMBOLS_COUNT = 254;
const MIN_USER_PASSWORD_SYMBOLS_COUNT = 6;
const MAX_USER_PASSWORD_SYMBOLS_COUNT = 35;

module.exports = Joi.object({
  firstName: Joi.string()
    .max(MAX_USER_FIRST_NAME_SYMBOLS_COUNT)
    .required()
    .messages({
      'string.base': `Имя пользователя должно быть типом "String"`,
      'string.max': `Имя пользователя не может быть больше ${MAX_USER_FIRST_NAME_SYMBOLS_COUNT} символов.`,
      'any.required': `Имя пользователя является обязательным полем.`
    }),
  lastName: Joi.string()
    .max(MAX_USER_LAST_NAME_SYMBOLS_COUNT)
    .required()
    .messages({
      'string.base': `Фамилия пользователя должна быть типом "String"`,
      'string.max': `Фамилия пользователя не может быть больше ${MAX_USER_LAST_NAME_SYMBOLS_COUNT} символов.`,
      'any.required': `Фамилия пользователя является обязательным полем.`
    }),
  email: Joi.string()
    .max(MAX_USER_LAST_NAME_SYMBOLS_COUNT)
    .email()
    .required()
    .messages({
      'string.base': `Email пользователя должен быть типом "String"`,
      'string.max': `Email  не может быть больше ${MAX_USER_EMAIL_SYMBOLS_COUNT} символов.`,
      'string.email': `Email должен быть реальным.`,
      'any.required': `Email является обязательным полем.`
    }),
  password: Joi.string()
    .min(MIN_USER_PASSWORD_SYMBOLS_COUNT)
    .max(MAX_USER_LAST_NAME_SYMBOLS_COUNT)
    .required()
    .messages({
      'string.base': `Пароль быть типом "String"`,
      'string.min': `Пароль не может быть меньше ${MIN_USER_PASSWORD_SYMBOLS_COUNT} символов.`,
      'string.max': `Пароль не может быть больше ${MAX_USER_PASSWORD_SYMBOLS_COUNT} символов.`,
      'any.required': `Пароль является обязательным полем.`
    }),
  repeatPassword: Joi.string()
    .required()
    .valid(Joi.ref(`password`))
    .messages({
      'any.only': `Пароли не совпадают`
    }),
  avatar: Joi.string()
    .regex(new RegExp(/\.(jpe?g|png)$/i))
    .optional()
    .allow(null)
    .messages({
      'string.base': `Название файла картинки должен быть типом "String"`,
      'any.regex': `Файл картинки должен быть в формате jpg или png.`
    }),
})
.with(`password`, `repeatPassword`)
;
