'use strict';

/**
 * Этот модуль запускает сервер.
 *
 *  @module src/service/cli/server
 */

const express = require(`express`);
const chalk = require(`chalk`);

const getIndexRouter = require(`../routers`);

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

    /**
     * Создаем экземпляр Express. И подключаем middleware для JSON
     * @type {Express}
     */
    const app = express();
    app.use(express.json());

    app.use(API_PREFIX, await getIndexRouter());

    app.listen(portNumber, (err) => {
      if (err) {
        console.log(chalk.red(`Ошибка при создании сервера: ${portNumber} \n ${err}`));
        return;
      }

      console.log(chalk.green(`Сервер поднят успешно на порту: ${portNumber}`));
    });
  }
};
