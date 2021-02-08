'use strict';
/**
 * Express сервер для запуска фронт-енда приложения.
 */

const express = require(`express`);
const chalk = require(`chalk`);

const rootRouter = require(`./routers/root`);
const myRouter = require(`./routers/my`);
const articlesRouter = require(`./routers/articles`);

/**
 * Номер порта для запуска по умолчанию
 *
 * @type {number}
 * @const
 * @default
 */
const PORT_NUMBER = 8080;

/**
 * Создаем экземпляр Express.
 * @type {*|Express}
 */
const app = express();

/**
 * Подключаем Router'ы для путей.
 */
app.use(`/`, rootRouter);
app.use(`/my`, myRouter);
app.use(`/offers`, articlesRouter);

/**
 * Запускаем сервер
 */
app.listen(PORT_NUMBER, (err) => {
  if (err) {
    console.log(chalk.red(err.message));
  }
  console.log(chalk.green(`Front server is started on port: ${PORT_NUMBER}`));
});
