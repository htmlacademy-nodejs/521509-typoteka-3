'use strict';

/**
 * Этот модуль выводит информацию о текущей версии.
 * Версия берется из package.json и выводится в консоль.
 *
 * @module src/service/cli/version
 */

const chalk = require(`chalk`);

const packageJSONFile = require(`../../../package.json`);

module.exports = {
  name: `--version`,
  run() {
    const version = packageJSONFile.version;
    console.info(chalk.blue(version));
  }
};
