'use strict';

const {readFileInJSON} = require(`../../utils`);

const Logger = require(`../../lib/logger`);

const logger = new Logger(`mock-reader`).getLogger();

/**
 * Класс для чтения файла с моками. Файл считывается при первом запросе, и записывается в локальную переменную.
 */
class MockDataReader {
  constructor(absoluteFilePath) {
    this._absoluteFilePath = absoluteFilePath;
    this._data = null;
  }

  async getData() {
    if (this._data === null) {
      logger.debug(`Reading file with mock data...`);
      try {
        this._data = await readFileInJSON(this._absoluteFilePath);
        logger.debug(`Read file with mock data successfully.`);
      } catch (err) {
        logger.error(`Error while reading mock data: ${err}`);
      }
    }
    return this._data;
  }
}

module.exports = MockDataReader;
