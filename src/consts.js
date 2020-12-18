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
 * @default
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
};


/**
 * Команда по умолчанию при запуске программы
 * @const
 * @type {string}
 * @default
 */
const DEFAULT_COMMAND = `--help`;

/**
 * с какого индекса аргумента начинается ввод пользователя. Первые 2 - путь до node.js и путь до сценария.
 *
 * @type {number}
 * @const
 * @default
 */
const USER_ARGV_INDEX = 2;

module.exports = {
  DEFAULT_COMMAND,
  HttpCode,
  ExitCodes,
  USER_ARGV_INDEX,
};
