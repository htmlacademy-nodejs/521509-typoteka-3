'use strict';
/**
 * Этот модуль содержит вспомогательные функции.
 *
 * @module src/utils
 */

const fs = require(`fs`).promises;

/**
 * getRandomNumber генерирует случайное число в пределах переданных функции.
 *
 * @param {Number} min - нижняя граница диапазона
 * @param {Number} max - верхняя граница диапазона
 * @return {number} - сгенирированное случайное число
 */

const getRandomNumber = (min = 0, max = 100) => {
  return Math.floor(Math.random() * max + min);
};

/**
 * getRandomItemInArray возвращает случайный элемент массива
 *
 * @param {Array} array - массив, из которого будет выбран случайный элемент
 * @return {*} - случайный элемент массива
 */

const getRandomItemInArray = (array) => {
  return array[getRandomNumber(0, array.length - 1)];
};

/**
 * shuffleArray - рандомно тасует элементы массива
 *
 * @param {Array} array - массив элементов
 * @return {Array} - тасованный массив
 */

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [array[i], array[randomPosition]] = [array[randomPosition], array[i]];
  }

  return array;
};

/**
 * getRandomItemsInArray - возвращает массив со несколькими случайными элементами массива, случайной длины
 *
 * @param {Array} array - исходный массив
 * @param {Number} maxCount - максимальное число элементов
 * @return {Array} - массив со случайными элементами случайной длины
 */
const getRandomItemsInArray = (array, maxCount = array.length - 1) => {
  return shuffleArray(array).slice(0, getRandomNumber(1, maxCount));
};

/**
 * Возвращает случайную Date в прошлом
 *
 * @param {Number} max - максимальный интервал в прошлом в миллисекундах
 * @return {Date} - случайная Date
 */
const getRandomDateInPast = (max) => {
  return new Date(Date.now() - getRandomNumber(0, max));
};


/**
 * Записывает данные в файл, и в случае ошибки завершает программу.
 *
 * @async
 * @param {string} filePath - путь до файла включая название файла
 * @param {object} data - объект, который должен быть записан в файл.
 * @return {Promise}
 *
 * @example
 * const {writeFile} = require('./utils);
 * try {
 *    await writeFile('test.txt', 'This is test string');
 *    console.log('success');
 * } catch (err) {
 *   console.log(err);
 * }
 */

const writeFileInJSON = async (filePath, data) => {
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, content);
};

/**
 * Читает файл и отдает отфильтрованный массив без пустых элементов и лишних пробелов.
 *
 * @param {string} filePath - абсолютный путь до файла
 * @param {string} encoding - кодировка, по умолчанию utf8
 * @return {Promise.<Array>} - возвращает Promise со информацией.
 */
const readFileToArray = async (filePath, encoding = `utf8`) => {
  const data = await fs.readFile(filePath, encoding);
  return data.split(`\n`).map((it) => it.trim()).filter((it) => it.length !== 0);
};

/**
 * Читает файл, c JSON информацией и возвращает прочитанный объект.
 *
 * @param {string} filePath - абсолютный путь до файла
 * @param {string} encoding - кодировка, по умолчанию utf8
 * @return {Promise.<Object>} - объект со информацией.
 */
const readFileInJSON = async (filePath, encoding = `utf8`) => {
  const data = await fs.readFile(filePath, encoding);
  return JSON.parse(data);
};

module.exports = {
  getRandomNumber,
  getRandomItemInArray,
  getRandomItemsInArray,
  getRandomDateInPast,
  writeFileInJSON,
  readFileToArray,
  readFileInJSON
};
