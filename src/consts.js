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
 * Длина id закачиваемых файлов
 *
 * @const
 * @type {Number}
 * @default 10
 */
const ID_LENGTH = 10;

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

/**
 * Возможные варианты окружений
 *
 * @const
 * @type {Object}
 */
const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`,
  TESTING: `testing`
};

/**
 * HTTP методы
 * @type {{PATH: string, DELETE: string, POST: string, GET: string, PUT: string}}
 */
const Methods = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  PATH: `PATH`,
  DELETE: `DELETE`
};

/**
 * Количество статей на странице по умолчанию
 *
 * @type {number}
 * @const
 * @default 8
 */
const DEFAULT_ARTICLES_COUNT_PER_PAGE = 8;

/**
 * Количество самых обсуждаемых статей на главной по умолчанию
 *
 * @type {number}
 * @const
 * @default 4
 */
const DEFAULT_ARTICLES_MOST_DISCUSSED_COUNT = 4;

/**
 * Количество последних комментариев на главной по умолчанию
 *
 * @type {number}
 * @const
 * @default 4
 */
const DEFAULT_LAST_COMMENTS_COUNT = 4;


module.exports = {
  DEFAULT_COMMAND,
  HttpCode,
  ID_LENGTH,
  ExitCodes,
  USER_ARGV_INDEX,
  Env,
  Methods,
  DEFAULT_ARTICLES_COUNT_PER_PAGE,
  DEFAULT_ARTICLES_MOST_DISCUSSED_COUNT,
  DEFAULT_LAST_COMMENTS_COUNT
};
