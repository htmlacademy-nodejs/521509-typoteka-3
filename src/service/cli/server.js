'use strict';

/**
 * Этот модуль запускает сервер.
 *
 *  @module src/service/cli/server
 */

const express = require(`express`);

const getIndexRouter = require(`../routers`);

const resourceNotFoundMiddleWare = require(`../middlewares/resource-not-found`);
const internalServerErrorMiddleWare = require(`../middlewares/internal-server-error`);

const Logger = require(`../../lib/logger`);

const {ExitCodes} = require(`../../consts`);

/**
 * Порт по умолчанию
 * @const
 * @type {number}
 * @default 3000
 */
const DEFAULT_PORT = 3000;

/**
 * API_PREFIX
 * @const
 * @type {string}
 * @default '/api'
 */
const API_PREFIX = `/api`;

module.exports = {
  name: `--server`,

  /**
   * Метод run запускает сервер на порту указанным пользователем. Если не указан на порту по умолчанию.
   *
   * @param {String} port - Номер порта на котором будет запущен сервер
   */

  async run(port) {
    /**
     * Считываем порт для запуска
     * @type {number|number}
     */
    const portNumber = Number.parseInt(port, 10) || DEFAULT_PORT;

    const logger = new Logger(`api-server`).getLogger();

    /**
     * Создаем экземпляр Express. И подключаем middleware для JSON
     * @type {Express}
     */
    const app = express();
    app.use(express.json());

    /**
     * Используем express-pino-logger для более подробного логирования запросов.
     * К каждому сообщению будет добавлена информация о запросе, в том числе id, чтобы проследить полный путь.
     */
    app.use(new Logger(`api-server`).getLoggerMiddleware());

    /**
     * Подключаем роутеры
     */
    app.use(API_PREFIX, await getIndexRouter());

    /**
     * Подключаем middleware для обработки ошибок
     */
    app.use(resourceNotFoundMiddleWare);
    app.use(internalServerErrorMiddleWare);

    app.listen(portNumber, (err) => {
      if (err) {
        logger.error(`Error on server starting on port: ${portNumber} \n ${err}`);
        process.exit(ExitCodes.FAIL);
        return;
      }

      logger.info(`Server is started on port: ${portNumber}`);
    });
  }
};
