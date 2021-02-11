'use strict';

const {readFileInJSON} = require(`../../utils`);

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
      this._data = await readFileInJSON(this._absoluteFilePath);
    }
    return this._data;
  }
}

module.exports = MockDataReader;
