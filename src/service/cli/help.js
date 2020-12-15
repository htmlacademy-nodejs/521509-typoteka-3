'use strict';

/**
 * Этот модуль выводит информацию для помощи в консоль.
 *
 * @module src/service/cli/help
 **/

module.exports = {
  name: `--help`,

  /**
   * Выводит в консоль информацию для помощи.
   */

  run() {
    console.info(`
      Программа запускает http-сервер и формирует файл с данными для API.
        Гайд:
        service.js <command>
        Команды:
        --version:            выводит номер версии
        --help:               печатает этот текст
        --generate <count>    формирует файл mocks.json
        `);
  }
};
