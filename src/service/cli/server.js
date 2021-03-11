'use strict';

/**
 * Этот модуль запускает сервер.
 *
 *  @module src/service/cli/server
 */

const http = require(`http`);

const express = require(`express`);
require(`dotenv`).config();

const getIndexRouter = require(`../routers`);

const DB = require(`../db`);
const resourceNotFoundMiddleWare = require(`../middlewares/resource-not-found`);
const internalServerErrorMiddleWare = require(`../middlewares/internal-server-error`);

const Logger = require(`../../lib/logger`);
const WebSocket = require(`../lib/web-socket`);

const {ExitCodes} = require(`../../consts`);

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
    const portNumber = Number.parseInt(port, 10) || +process.env.API_SERVICE_PORT;

    const logger = new Logger(`api-server`).getLogger();

    /**
     * Пробуем подключиться к базе данных.
     */

    const db = new DB().getDB();
    try {
      logger.info(`Connecting to DB...`);
      await db.authenticate();
      logger.info(`Connection with DB is established.`);
    } catch (error) {
      logger.error(`Couldn't connect to DB: ${error}`);
      process.exit(ExitCodes.FAIL);
    }

    /**
     * Создаем экземпляр Express. И подключаем middleware для JSON
     * @type {Express}
     */
    const app = express();
    app.use(express.json());

    /**
     * Так как помимо экспресса будет ещё и socket.io подключаем http и поднимаем сокет
     */
    const server = http.createServer(app);
    const webSocket = new WebSocket(server);

    /**
     * Используем express-pino-logger для более подробного логирования запросов.
     * К каждому сообщению будет добавлена информация о запросе, в том числе id, чтобы проследить полный путь.
     */
    app.use(new Logger(`api-server`).getLoggerMiddleware(`api`));

    /**
     * Подключаем роутеры
     */
    app.use(process.env.API_PREFIX, await getIndexRouter(db, webSocket));

    /**
     * Подключаем middleware для обработки ошибок
     */
    app.use(resourceNotFoundMiddleWare);
    app.use(internalServerErrorMiddleWare);

    server.listen(portNumber, () => {
      logger.info(`Server is started on port: ${portNumber}`);
    });

    server.on(`error`, (error) => {
      logger.error(`Error on server starting on port: ${portNumber} \n ${error}`);
      process.exit(ExitCodes.FAIL);
    });
  }
};
