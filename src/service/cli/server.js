'use strict';

/**
 * Этот модуль запускает сервер.
 *
 *  @module src/service/cli/server
 */

const path = require(`path`);
const http = require(`http`);

const chalk = require(`chalk`);

const {HttpCode} = require(`../../consts`);
const {readFileInJSON} = require(`../../utils`);

/**
 * Порт по умолчанию
 * @const
 * @type {number}
 * @default
 */
const DEFAULT_PORT = 3000;

/**
 * Сообщение по умолчанию, если ресурс не найден
 * @const
 * @type {string}
 * @default
 */
const NOT_FOUND_MESSAGE = `Not found`;

/**
 * Название файла для записи результата
 * @const
 * @type {string}
 * @default
 */
const FILE_NAME = `mocks.json`;

/**
 * Относительный путь к корневому каталогу
 * @const
 * @type {string}
 * @default
 */
const PATH_TO_ROOT_FOLDER = `../../../`;


/**
 * Функция для ответа пользователю. Принимает объект для ответа, код статуса и сообщение.
 * Вызывает метод для отправки ответа.
 *
 * @param {Object} res - объект для ответа клиенту
 * @param {string} statusCode - код ответа
 * @param {string} message - сообщение для пользователя
 */
const sendResponse = (res, statusCode, message) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>Типотека</title>
      </head>
      <body>${message}</body>
    </html>`.trim();

  res.statusCode = statusCode;
  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  res.end(template);
};

/**
 * Функция для обработки запроса от пользователя. Временно содержит роутинг.
 *
 * @param {Object} req - объект запроса к серверу
 * @param {Object} res - объект для ответа клиенту
 */
const onClientConnect = async (req, res) => {
  switch (req.url) {
    case `/` : {
      try {
        const articles = await readFileInJSON(path.join(__dirname, PATH_TO_ROOT_FOLDER, FILE_NAME));
        const message = `<ul>${articles.map((advert) => `<li>${advert.title}</li>`).join(``)}</ul>`;
        sendResponse(res, HttpCode.OK, message);
      } catch (e) {
        sendResponse(res, HttpCode.NOT_FOUND, NOT_FOUND_MESSAGE);
      }
      break;
    }
    default : {
      sendResponse(res, HttpCode.NOT_FOUND, NOT_FOUND_MESSAGE);
      break;
    }
  }
};

module.exports = {
  name: `--server`,

  /**
   * Метод run запускает сервер на порту указанным пользователем. Если не указан на порту по умолчанию.
   *
   * @param {String} port - Номер порта на котором будет запущен сервер
   */

  async run(port) {
    const portNumber = Number.parseInt(port, 10) || DEFAULT_PORT;

    http.createServer(onClientConnect)
      .listen(portNumber)
      .on(`listening`, (err) => {
        if (err) {
          console.log(chalk.red(`Ошибка при создании сервера: ${portNumber} \n ${err}`));
          return;
        }

        console.log(chalk.green(`Сервер поднят успешно на порту: ${portNumber}`));
      });
  }
};
