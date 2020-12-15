'use strict';
/**
 * Этот модуль содержит вспомогательные функции.
 *
 * @module src/utils
 */

const fs = require(`fs`);

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
 * @param {function} callback - функция, которая вызывается по завершению записи в файл
 *
 * @example
 * const {writeFile} = require('./utils);
 * writeFile('test.txt', 'This is test string', e => {
 *   if (err) {
 *     console.log(err);
 *     return;
 *   }
 *   console.log('success');
 * };
 */

const writeFileInJSON = (filePath, data, callback) => {
  const content = JSON.stringify(data, null, 2);
  fs.writeFile(filePath, content, callback);
};

module.exports = {
  getRandomNumber,
  getRandomItemInArray,
  getRandomItemsInArray,
  getRandomDateInPast,
  writeFileInJSON
};
