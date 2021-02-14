'use strict';
/**
 * Express сервер для запуска фронт-енда приложения.
 */
const path = require(`path`);

const express = require(`express`);

const rootRouter = require(`./routers/root`);
const myRouter = require(`./routers/my`);
const articlesRouter = require(`./routers/articles`);

const Logger = require(`../lib/logger`);

/**
 * Номер порта для запуска по умолчанию
 *
 * @type {number}
 * @const
 * @default 8080
 */
const PORT_NUMBER = 8080;

/**
 * Путь до папки со статикой public. Она будет будет полностью доступна с помощью express.static.
 *
 * @const
 * @type {string}
 * @default public
 */
const PATH_TO_PUBLIC_DIR = `public`;

/**
 * Путь до папки для приема файлов от пользователей. Она будет будет полностью доступна с помощью express.static.
 *
 * @const
 * @type {string}
 * @default
 */
const PATH_TO_UPLOAD_DIR = `../../upload`;

/**
 * Путь до папки с шаблономи.
 *
 * @const
 * @type {string}
 * @default templates
 */
const PATH_TO_TEMPLATES_DIR = `templates`;

/**
 * Создаем экземпляр Express.
 * @type {*|Express}
 */
const app = express();

const logger = new Logger(`front-server`).getLogger();

/**
 * Устанавливаем pug, как шаблонизатор по умолчанию и указываем путь до шаблонов.
 */
app.set(`views`, path.resolve(__dirname, PATH_TO_TEMPLATES_DIR));
app.set(`view engine`, `pug`);

app.use(express.urlencoded({
  extended: true
}));


/**
 * Добавляем отдачу статичных файлов.
 */
app.use(express.static(path.resolve(__dirname, PATH_TO_PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, PATH_TO_UPLOAD_DIR)));

/**
 * Используем express-pino-logger для более подробного логирования запросов.
 * К каждому сообщению будет добавлена информация о запросе, в том числе id, чтобы проследить полный путь.
 * Добавлен после подключения статичных файлов, чтобы не гадить в логи.
 */
app.use(new Logger(`front-server`).getLoggerMiddleware());


/**
 * Подключаем Router'ы для путей.
 */
app.use(`/`, rootRouter);
app.use(`/my`, myRouter);
app.use(`/articles`, articlesRouter);


/**
 * Добавляем обработчики ошибок.
 */
app.use((req, res) => res.status(404).render(`errors/404`));

app.use((err, req, res, _next) => {
  req.log.error(err.stack);
  res.status(500).render(`errors/500`);
});


/**
 * Запускаем сервер
 */
app.listen(PORT_NUMBER, (err) => {
  if (err) {
    logger.error(err.message);
  }
  logger.info(`Front server is started on port: ${PORT_NUMBER}`);
});
