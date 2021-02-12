'use strict';

/**
 * Этот модуль содержит константы
 *
 * @module src/consts
 */

/**
 * Коды завершения программы
 * @const
 * @type {{SUCCESS: number, FAIL: number}}
 */
const ExitCodes = {
  SUCCESS: 0,
  FAIL: 1
};

/**
 * Коды для ответов сервера
 *
 * @const
 * @type {Object}
 */
const HttpCode = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  CREATED: 201,
  DELETED: 204,
  BAD_REQUEST: 400
};

/**
 * Длина id
 *
 * @const
 * @type {Number}
 */
const ID_LENGTH = 4;

/**
 * Команда по умолчанию при запуске программы
 * @const
 * @type {string}
 * @default `--help`
 */
const DEFAULT_COMMAND = `--help`;

/**
 * с какого индекса аргумента начинается ввод пользователя. Первые 2 - путь до node.js и путь до сценария.
 *
 * @type {number}
 * @const
 * @default 2
 */
const USER_ARGV_INDEX = 2;

module.exports = {
  DEFAULT_COMMAND,
  HttpCode,
  ID_LENGTH,
  ExitCodes,
  USER_ARGV_INDEX,
};
